import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function getProducts(userId: string, opts: { limit?: number } = {}) {
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

  return newProduct;
}

// -------------------------------------------------------------------------------------------------
