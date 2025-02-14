import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TOPICS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

// -------------------------------------------------------------------------------------------------
// Delete User Data by Clerk User Id
export async function deleteUser(clerkUserId: string) {
  // Execute Transaction (if any of the operations fails, it'll rollback the previous changes)
  const [userSubscriptions, products] = await db.batch([
    // Delete user subscription by Clerk User Id
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
      }),
    // Delete all products of the user by Clerk User Id
    db
      .delete(ProductTable)
      .where(eq(ProductTable.clerkUserId, clerkUserId))
      .returning({
        id: ProductTable.id,
      }),
  ]);

  // Revalidate cache
  userSubscriptions.forEach((sub) => {
    revalidateDbCache({
      topic: CACHE_TOPICS.subscription,
      id: sub.id,
      userId: clerkUserId,
    });
  });

  // Revalidate cache
  products.forEach((prod) => {
    revalidateDbCache({
      topic: CACHE_TOPICS.products,
      id: prod.id,
      userId: clerkUserId,
    });
  });

  return [userSubscriptions, products];
}
