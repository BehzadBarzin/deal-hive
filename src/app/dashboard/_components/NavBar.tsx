import { BrandLogo } from "@/components/BrandLogo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const DashboardNavBar = () => {
  return (
    <header className="max-sm:hidden flex py-6 shadow-md fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/dashboard" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
        <UserButton />
      </nav>
    </header>
  );
};

export default DashboardNavBar;
