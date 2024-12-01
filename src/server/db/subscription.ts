import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";

// -------------------------------------------------------------------------------------------------
// Create User Subscription
export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const [newSubscription] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      // If Clerk User Id already exists, do nothing (abort insert)
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      // Only return the id and Clerk User Id
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  return newSubscription;
}
