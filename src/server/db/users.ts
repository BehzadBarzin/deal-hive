import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
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

  return [userSubscriptions, products];
}
