import { getUserSubscriptionTier } from "./db/subscriptions";
import { getProductCount } from "./db/products";

// -------------------------------------------------------------------------------------------------
export async function canRemoveBranding(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  return tier.canRemoveBranding;
}

// -------------------------------------------------------------------------------------------------
export async function canCustomizeBanner(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  return tier.canCustomizeBanner;
}

// -------------------------------------------------------------------------------------------------
export async function canCreateProduct(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);
  return productCount < tier.maxNumberOfProducts;
}

// -------------------------------------------------------------------------------------------------
