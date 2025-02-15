import { db } from "@/drizzle/db";
import {
  CountryGroupDiscountTable,
  ProductCustomizationTable,
  ProductTable,
} from "@/drizzle/schema";
import {
  CACHE_TOPICS,
  cacheFunction,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { removeTrailingSlash } from "@/lib/utils";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";

// Get product from DB (with caching)
export function getProducts(userId: string, opts: { limit?: number } = {}) {
  // Wrap the _getProducts function with cache
  const cachedFunction = cacheFunction(_getProducts, {
    tags: [getUserTag(userId, CACHE_TOPICS.products)],
  });

  // Call the cached function's response
  return cachedFunction(userId, opts);
}

// Get Products from DB (without caching)
function _getProducts(userId: string, opts: { limit?: number } = {}) {
  return db.query.ProductTable.findMany({
    where: (fields, operators) => {
      return operators.eq(fields.clerkUserId, userId);
    },
    orderBy: (fields, operators) => {
      return operators.desc(fields.createdAt);
    },
    limit: opts.limit,
  });
}

// -------------------------------------------------------------------------------------------------
// Create Product in DB
export async function createProduct(data: typeof ProductTable.$inferInsert) {
  const [newProduct] = await db
    .insert(ProductTable)
    .values(data)
    .returning({ id: ProductTable.id, userId: ProductTable.clerkUserId });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      // If product customization already exists, do nothing
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId, // Conflict on this
      });
  } catch {
    // If there's an error, delete the product
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
  }

  // Revalidate cache
  revalidateDbCache({
    topic: CACHE_TOPICS.products,
    userId: newProduct.userId,
    id: newProduct.id,
  });

  return newProduct;
}

// -------------------------------------------------------------------------------------------------
// Delete Product from DB
export async function deleteProduct({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));

  // Revalidate cache
  if (rowCount > 0) {
    revalidateDbCache({
      topic: CACHE_TOPICS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
}

// -------------------------------------------------------------------------------------------------
// Get single product (with caching)
export async function getProduct(opts: { id: string; userId: string }) {
  // Wrap the _getProduct function with cache
  const cachedFunction = cacheFunction(_getProduct, {
    tags: [getIdTag(opts.id, CACHE_TOPICS.products)],
  });

  // Call the cached function's response
  return cachedFunction(opts);
}

// Get single product (no caching)
async function _getProduct(opts: { id: string; userId: string }) {
  return db.query.ProductTable.findFirst({
    where: (fields, { eq, and }) => {
      return and(eq(fields.id, opts.id), eq(fields.clerkUserId, opts.userId));
    },
  });
}

// -------------------------------------------------------------------------------------------------
export async function updateProduct(
  data: Partial<typeof ProductTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const { rowCount } = await db
    .update(ProductTable)
    .set(data)
    .where(and(eq(ProductTable.clerkUserId, userId), eq(ProductTable.id, id)));

  if (rowCount > 0) {
    revalidateDbCache({
      topic: CACHE_TOPICS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
}

// -------------------------------------------------------------------------------------------------

export async function updateCountryDiscounts(
  deleteGroup: { countryGroupId: string }[],
  insertGroup: (typeof CountryGroupDiscountTable.$inferInsert)[],
  { productId, userId }: { productId: string; userId: string }
) {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return false;

  const statements: BatchItem<"pg">[] = [];
  if (deleteGroup.length > 0) {
    statements.push(
      db.delete(CountryGroupDiscountTable).where(
        and(
          eq(CountryGroupDiscountTable.productId, productId),
          inArray(
            CountryGroupDiscountTable.countryGroupId,
            deleteGroup.map((group) => group.countryGroupId)
          )
        )
      )
    );
  }

  if (insertGroup.length > 0) {
    statements.push(
      db
        .insert(CountryGroupDiscountTable)
        .values(insertGroup)
        .onConflictDoUpdate({
          target: [
            CountryGroupDiscountTable.productId,
            CountryGroupDiscountTable.countryGroupId,
          ],
          set: {
            coupon: sql.raw(
              `excluded.${CountryGroupDiscountTable.coupon.name}`
            ),
            discountPercentage: sql.raw(
              `excluded.${CountryGroupDiscountTable.discountPercentage.name}`
            ),
          },
        })
    );
  }

  if (statements.length > 0) {
    await db.batch(statements as [BatchItem<"pg">]);
  }

  revalidateDbCache({
    topic: CACHE_TOPICS.products,
    userId,
    id: productId,
  });
}
// -------------------------------------------------------------------------------------------------

export function getProductCountryGroups({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const cacheFn = cacheFunction(_getProductCountryGroups, {
    tags: [
      getIdTag(productId, CACHE_TOPICS.products),
      getGlobalTag(CACHE_TOPICS.countries),
      getGlobalTag(CACHE_TOPICS.countryGroups),
    ],
  });

  return cacheFn({ productId, userId });
}

async function _getProductCountryGroups({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  // Get the product from `getProduct` function to make sure that the user has access to the product
  const product = await getProduct({ id: productId, userId });
  if (product == null) return [];

  const data = await db.query.CountryGroupTable.findMany({
    with: {
      countries: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        where: ({ productId: id }, { eq }) => eq(id, productId),
        limit: 1,
      },
    },
  });

  return data.map((group) => {
    return {
      id: group.id,
      name: group.name,
      recommendedDiscountPercentage: group.recommendedDiscountPercentage,
      countries: group.countries,
      discount: group.countryGroupDiscounts.at(0),
    };
  });
}
// -------------------------------------------------------------------------------------------------

export function getProductCustomization({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const cacheFn = cacheFunction(_getProductCustomization, {
    tags: [getIdTag(productId, CACHE_TOPICS.products)],
  });

  return cacheFn({ productId, userId });
}

async function _getProductCustomization({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(id, productId), eq(clerkUserId, userId)),
    with: {
      productCustomization: true,
    },
  });

  return data?.productCustomization;
}
// -------------------------------------------------------------------------------------------------
export async function updateProductCustomization(
  data: Partial<typeof ProductCustomizationTable.$inferInsert>,
  { productId, userId }: { productId: string; userId: string }
) {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return;

  await db
    .update(ProductCustomizationTable)
    .set(data)
    .where(eq(ProductCustomizationTable.productId, productId));

  revalidateDbCache({
    topic: CACHE_TOPICS.products,
    userId,
    id: productId,
  });
}

// -------------------------------------------------------------------------------------------------
export function getProductCount(userId: string) {
  const cacheFn = cacheFunction(_getProductCount, {
    tags: [getUserTag(userId, CACHE_TOPICS.products)],
  });

  return cacheFn(userId);
}

async function _getProductCount(userId: string) {
  const counts = await db
    .select({ productCount: count() })
    .from(ProductTable)
    .where(eq(ProductTable.clerkUserId, userId));

  return counts[0]?.productCount ?? 0;
}
// -------------------------------------------------------------------------------------------------
export function getProductForBanner({
  id,
  countryCode,
  url,
}: {
  id: string;
  countryCode: string;
  url: string;
}) {
  const cacheFn = cacheFunction(_getProductForBanner, {
    tags: [
      getIdTag(id, CACHE_TOPICS.products),
      getGlobalTag(CACHE_TOPICS.countries),
      getGlobalTag(CACHE_TOPICS.countryGroups),
    ],
  });

  return cacheFn({
    id,
    countryCode,
    url,
  });
}

async function _getProductForBanner({
  id,
  countryCode,
  url,
}: {
  id: string;
  countryCode: string;
  url: string;
}) {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id: idCol, url: urlCol }, { eq, and }) =>
      and(eq(idCol, id), eq(urlCol, removeTrailingSlash(url))),
    columns: {
      id: true,
      clerkUserId: true,
    },
    with: {
      productCustomization: true,
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        with: {
          countryGroup: {
            columns: {},
            with: {
              countries: {
                columns: {
                  id: true,
                  name: true,
                },
                limit: 1,
                where: ({ code }, { eq }) => eq(code, countryCode),
              },
            },
          },
        },
      },
    },
  });

  const discount = data?.countryGroupDiscounts.find(
    (discount) => discount.countryGroup.countries.length > 0
  );
  const country = discount?.countryGroup.countries[0];
  const product =
    data == null || data.productCustomization == null
      ? undefined
      : {
          id: data.id,
          clerkUserId: data.clerkUserId,
          customization: data.productCustomization,
        };

  return {
    product,
    country,
    discount:
      discount == null
        ? undefined
        : {
            coupon: discount.coupon,
            percentage: discount.discountPercentage,
          },
  };
}
// -------------------------------------------------------------------------------------------------
