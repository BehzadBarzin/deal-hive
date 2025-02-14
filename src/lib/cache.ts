import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

// -------------------------------------------------------------------------------------------------
/**
 * This file has some helpers to manage Next.js's caching mechanism.
 *
 * We'll have 3 levels of caching:
 *  - Global cache: It is used to cache data that is shared between all users, products, etc.
 *  - User cache: It is used to cache data that is specific to a user (user's products, etc).
 *  - Id cache: It is used to cache data that is specific to an id (a specific product, user, etc.).
 */
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// Type of valid cache tags
export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

// -------------------------------------------------------------------------------------------------
// Cache Topics
export const CACHE_TOPICS = {
  products: "products",
  productViews: "productViews",
  subscription: "subscription",
  countries: "countries",
  countryGroups: "countryGroups",
} as const;

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// Returns Global cache Tag for a specific topic (e.g. all products)
export function getGlobalTag(topic: keyof typeof CACHE_TOPICS) {
  return `global:${CACHE_TOPICS[topic]}` as const;
}

// -------------------------------------------------------------------------------------------------
// Returns a User's cache Tag for a specific topic (e.g. a user's products)
export function getUserTag(userId: string, topic: keyof typeof CACHE_TOPICS) {
  return `user:${userId}-${CACHE_TOPICS[topic]}` as const;
}

// -------------------------------------------------------------------------------------------------
// Returns an Id's cache Tag for a specific topic (e.g. a single product)
export function getIdTag(id: string, topic: keyof typeof CACHE_TOPICS) {
  return `id:${id}-${CACHE_TOPICS[topic]}` as const;
}

// -------------------------------------------------------------------------------------------------
// Clears all cache data
// -------------------------------------------------------------------------------------------------
export function clearFullCache() {
  // Note: We need to add a "*" tag to all caches to be able to revalidate them here.
  revalidateTag("*");
}

// -------------------------------------------------------------------------------------------------
// Function to create a cached function
// -------------------------------------------------------------------------------------------------
/**
 * Wraps a function to be cached, and returns the cached function.
 * Calling the returned function will return the cached data.
 *
 * ---
 *
 * `F extends (...args: any[]) => Promise<any>` → A generic type for the function being passed to cacheFunction
 * `cb: Parameters<typeof unstable_cache<F>>[0]` → type of the first parameter of unstable_cache given the generic type F
 * `{ tags: ValidTags[] }` → Options for the cache, which accepts an array of ValidTags as `tags`
 *
 * ---
 *
 * @param cb - The function that returns the data to be cached
 * @param opts - The options for the cache ({ tags: [...] })
 * @returns
 */
export function cacheFunction<F extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<F>>[0],
  { tags }: { tags: ValidTags[] } // tags → type of an array of ValidTags
): F {
  // cache(): React function to cache data for each individual request
  // unstable_cache(): Next.js function to cache data across multiple requests
  // Usage: cache(unstable_cache(() => /* Return Data To Be Cached */), undefined, { tags: ["cache-tag-1"] });
  // So we must call the function that returns the data to be cached, within the first callback argument of cache/unstable_cache.
  return cache(unstable_cache<F>(cb, undefined, { tags: [...tags, "*"] }));
}

// -------------------------------------------------------------------------------------------------
// Function to revalidate cache
// -------------------------------------------------------------------------------------------------
// Revalidate Db cache
export function revalidateDbCache({
  topic,
  userId,
  id,
}: {
  topic: keyof typeof CACHE_TOPICS;
  userId?: string;
  id?: string;
}) {
  // Revalidate Global cache
  revalidateTag(getGlobalTag(topic));
  // If userId is provided, revalidate User cache
  if (userId != null) {
    revalidateTag(getUserTag(userId, topic));
  }
  // If id is provided, revalidate Id cache
  if (id != null) {
    revalidateTag(getIdTag(id, topic));
  }
}

// -------------------------------------------------------------------------------------------------
