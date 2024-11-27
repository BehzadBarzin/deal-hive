import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionTiersInOrder } from "@/data/subscriptionTiers";
import { formatCompactNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { SignUpButton } from "@clerk/nextjs";
import { FC } from "react";
import Feature from "./Feature";

interface IProps {
  subscriptionTier: (typeof subscriptionTiersInOrder)[number]; // Type of one (either) of the elements in the array
}

const PricingCard: FC<IProps> = ({ subscriptionTier }) => {
  // -----------------------------------------------------------------------------------------------
  // Extract variables
  const {
    name,
    priceInCents,
    maxNumberOfVisits,
    maxNumberOfProducts,
    canRemoveBranding,
    canAccessAnalytics,
    canCustomizeBanner,
  } = subscriptionTier;

  // -----------------------------------------------------------------------------------------------
  // Set `Standard` Tier as the most popular
  const isMostPopular = name === "Standard";

  // -----------------------------------------------------------------------------------------------
  return (
    <Card
      className={cn(
        "relative shadow-none rounded-3xl overflow-hidden",
        isMostPopular ? "border-accent border-2" : "border-none"
      )}
    >
      {/* -------------------------------------------------------------------------------------- */}
      {isMostPopular && (
        <div className="bg-accent text-accent-foreground absolute py-1 px-10 -right-8 top-24 rotate-45 origin-top-right">
          Most popular
        </div>
      )}
      {/* -------------------------------------------------------------------------------------- */}
      {/* Card Header */}
      <CardHeader>
        {/* Name */}
        <div className="text-accent font-semibold mb-8">{name}</div>
        {/* Price */}
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        {/* Visits per month */}
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      {/* Card Content */}
      <CardContent>
        {/* Sign Up Button */}
        <SignUpButton>
          <Button
            className="text-lg w-full rounded-lg"
            variant={isMostPopular ? "accent" : "default"}
          >
            Get Started
          </Button>
        </SignUpButton>
      </CardContent>
      {/* Card Footer */}
      <CardFooter className="flex flex-col gap-4 items-start">
        {/* Feature: Max number of products */}
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        {/* Feature */}
        <Feature>
          <span className="italic">Deal Hive</span> discounts
        </Feature>
        {/* Feature: Analytics */}
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {/* Feature: Remove branding */}
        {canRemoveBranding && (
          <Feature>
            Remove <span className="italic">Deal Hive</span> branding
          </Feature>
        )}
        {/* Feature: Banner customization */}
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
