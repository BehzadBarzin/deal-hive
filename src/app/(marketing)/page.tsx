import { Button } from "@/components/ui/button";
import { subscriptionTiersInOrder } from "@/data/subscriptionTiers";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon, Globe2Icon } from "lucide-react";
import Link from "next/link";
import PricingCard from "./_components/PricingCard";
import FooterLinkGroup from "./_components/FooterLinkGroup";
import { BrandLogo } from "@/components/BrandLogo";

export default function Home() {
  return (
    <>
      {/* -------------------------------------------------------------------------------------- */}
      {/* Hero */}
      <section className="min-h-screen bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4">
          Price Smarter, Sell bigger!
        </h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl">
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </p>
        {/* Sign Up Button */}
        <SignUpButton>
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            Get started for free <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>
      </section>
      {/* -------------------------------------------------------------------------------------- */}
      {/* Partners */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col gap-16 px-8 md:px-16">
          <h2 className="text-3xl text-center text-balance">
            Trusted by the top modern companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
            {/* Generate 10 Items */}
            {Array.from({ length: 10 }).map((_, index) => (
              <Link key={index} href="#">
                <div className="flex items-center justify-center gap-2">
                  <Globe2Icon className="size-16" />
                  <span className="text-2xl font-extrabold">Company</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* -------------------------------------------------------------------------------------- */}
      {/* Pricing */}
      <section id="pricing" className="px-8 py-16 bg-accent/5">
        <h2 className="text-4xl text-center text-balance font-semibold mb-8">
          Pricing software which pays for itself 20x over
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {/* Pricing Cards */}
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCard key={tier.name} subscriptionTier={tier} />
          ))}
        </div>
      </section>
      {/* -------------------------------------------------------------------------------------- */}
      {/* Footer */}
      <footer className="container pt-16 pb-8 flex flex-col sm:flex-row gap-8 sm:gap-4 justify-between items-start">
        {/* Logo */}
        <Link href="/">
          <BrandLogo width={248} />
        </Link>
        {/* ------------------------------------------------------------------------------------ */}
        {/* Links */}
        {/* Link Columns (screen < sm → Rows) */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* ---------------------------------------------------------------------------------- */}
          {/* Col 1 */}
          <div className="flex flex-col gap-8">
            {/* Link Group: Help */}
            <FooterLinkGroup
              title="Help"
              links={[
                { label: "Deal Hive Discounts", href: "#" },
                { label: "Discount API", href: "#" },
              ]}
            />
            {/* Link Group: Solutions */}
            <FooterLinkGroup
              title="Solutions"
              links={[
                { label: "Newsletter", href: "#" },
                { label: "SaaS Business", href: "#" },
                { label: "Online Courses", href: "#" },
              ]}
            />
          </div>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Col 2 */}
          <div className="flex flex-col gap-8">
            {/* Link Group: Features */}
            <FooterLinkGroup
              title="Features"
              links={[{ label: "Deal Hive Discounts", href: "#" }]}
            />
            {/* Link Group: Tools */}
            <FooterLinkGroup
              title="Tools"
              links={[
                { label: "Salary Converter", href: "#" },
                { label: "Coupon Generator", href: "#" },
                { label: "Stripe App", href: "#" },
              ]}
            />
            {/* Link Group: Company */}
            <FooterLinkGroup
              title="Company"
              links={[
                { label: "Affiliate", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "Terms of Service", href: "#" },
              ]}
            />
          </div>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Col 3 */}
          <div className="flex flex-col gap-8">
            {/* Link Group: Integrations */}
            <FooterLinkGroup
              title="Integrations"
              links={[
                { label: "Lemon Squeezy", href: "#" },
                { label: "Gumroad", href: "#" },
                { label: "Stripe", href: "#" },
                { label: "Chargebee", href: "#" },
                { label: "Paddle", href: "#" },
              ]}
            />
            {/* Link Group: Tutorials */}
            <FooterLinkGroup
              title="Tutorials"
              links={[
                { label: "Any Website", href: "#" },
                { label: "Lemon Squeezy", href: "#" },
                { label: "Gumroad", href: "#" },
                { label: "Stripe", href: "#" },
                { label: "Chargebee", href: "#" },
                { label: "Paddle", href: "#" },
              ]}
            />
          </div>
          {/* ---------------------------------------------------------------------------------- */}
        </div>
        {/* ------------------------------------------------------------------------------------ */}
      </footer>
      {/* -------------------------------------------------------------------------------------- */}
    </>
  );
}
