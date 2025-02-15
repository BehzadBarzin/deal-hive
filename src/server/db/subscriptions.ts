import { subscriptionTiers } from "@/data/subscriptionTiers";
import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TOPICS, revalidateDbCache } from "@/lib/cache";

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

  // Revalidate cache
  if (newSubscription != null) {
    revalidateDbCache({
      topic: CACHE_TOPICS.subscription,
      userId: newSubscription.userId,
      id: newSubscription.id,
    });
  }

  return newSubscription;
}

// -------------------------------------------------------------------------------------------------

export async function getUserSubscriptionTier(userId: string) {
  const subscription = await _getUserSubscription(userId);

  if (subscription == null) throw new Error("User has no subscription");

  return subscriptionTiers[subscription.tier];
}

function _getUserSubscription(userId: string) {
  return db.query.UserSubscriptionTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
  });
}

// -------------------------------------------------------------------------------------------------
