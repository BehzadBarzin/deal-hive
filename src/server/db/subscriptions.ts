import { subscriptionTiers } from "@/data/subscriptionTiers";
import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import {
  CACHE_TOPICS,
  cacheFunction,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { SQL } from "drizzle-orm";

// -------------------------------------------------------------------------------------------------

export function getUserSubscription(userId: string) {
  const cacheFn = cacheFunction(_getUserSubscription, {
    tags: [getUserTag(userId, CACHE_TOPICS.subscription)],
  });

  return cacheFn(userId);
}

function _getUserSubscription(userId: string) {
  return db.query.UserSubscriptionTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
  });
}
// -------------------------------------------------------------------------------------------------
export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const [newSubscription] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscription != null) {
    revalidateDbCache({
      topic: CACHE_TOPICS.subscription,
      id: newSubscription.id,
      userId: newSubscription.userId,
    });
  }

  return newSubscription;
}

// -------------------------------------------------------------------------------------------------

export async function updateUserSubscription(
  where: SQL,
  data: Partial<typeof UserSubscriptionTable.$inferInsert>
) {
  const [updatedSubscription] = await db
    .update(UserSubscriptionTable)
    .set(data)
    .where(where)
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (updatedSubscription != null) {
    revalidateDbCache({
      topic: CACHE_TOPICS.subscription,
      userId: updatedSubscription.userId,
      id: updatedSubscription.id,
    });
  }
}

// -------------------------------------------------------------------------------------------------

export async function getUserSubscriptionTier(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (subscription == null) throw new Error("User has no subscription");

  return subscriptionTiers[subscription.tier];
}

// -------------------------------------------------------------------------------------------------
