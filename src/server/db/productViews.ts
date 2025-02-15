import { db } from "@/drizzle/db";
import { ProductTable, ProductViewTable } from "@/drizzle/schema";
import {
  CACHE_TOPICS,
  cacheFunction,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { and, count, eq, gte } from "drizzle-orm";

// -------------------------------------------------------------------------------------------------

export function getProductViewCount(userId: string, startDate: Date) {
  const cacheFn = cacheFunction(_getProductViewCount, {
    tags: [getUserTag(userId, CACHE_TOPICS.productViews)],
  });

  return cacheFn(userId, startDate);
}

async function _getProductViewCount(userId: string, startDate: Date) {
  const counts = await db
    .select({ pricingViewCount: count() })
    .from(ProductViewTable)
    .innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId))
    .where(
      and(
        eq(ProductTable.clerkUserId, userId),
        gte(ProductViewTable.visitedAt, startDate)
      )
    );

  return counts[0]?.pricingViewCount ?? 0;
}

// -------------------------------------------------------------------------------------------------

export async function createProductView({
  productId,
  countryId,
  userId,
}: {
  productId: string;
  countryId?: string;
  userId: string;
}) {
  const [newRow] = await db
    .insert(ProductViewTable)
    .values({
      productId: productId,
      visitedAt: new Date(),
      countryId: countryId,
    })
    .returning({ id: ProductViewTable.id });

  if (newRow != null) {
    revalidateDbCache({
      topic: CACHE_TOPICS.productViews,
      userId,
      id: newRow.id,
    });
  }
}

// -------------------------------------------------------------------------------------------------
