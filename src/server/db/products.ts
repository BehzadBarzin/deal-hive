import { db } from "@/drizzle/db";

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
