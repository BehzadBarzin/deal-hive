import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import {
  CACHE_TOPICS,
  cacheFunction,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { and, eq } from "drizzle-orm";

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
