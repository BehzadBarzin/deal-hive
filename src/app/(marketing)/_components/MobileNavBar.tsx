import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const MobileNavBar = () => {
  // -----------------------------------------------------------------------------------------------
  return (
    <header className="sm:hidden flex p-6 shadow-md fixed top-0 w-full z-10 bg-background/95 justify-between">
      {/* Left Side */}
      {/* Logo---------------------------------------------------------------------------------- */}
      <BrandLogo />
      {/* -------------------------------------------------------------------------------------- */}
      {/* Right Side */}
      <div className="flex gap-3 px-6">
        {/* User Button */}
        <SignedIn>
          {/* Only show if signed in */}
          <UserButton />
        </SignedIn>
        {/* Sheet------------------------------------------------------------------------------- */}
        <Sheet>
          {/* Trigger--------------------------------------------------------------------------- */}
          <SheetTrigger>
            <MenuIcon className="size-6" />
          </SheetTrigger>
          {/* Content--------------------------------------------------------------------------- */}
          <SheetContent side="top" className="border-none bg-dark-1 text-white">
            {/* Logo---------------------------------------------------------------------------- */}
            {/* Using SheetClose around our links means that if any link is clicked, close the sheet */}
            {/* Nav Links----------------------------------------------------------------------- */}
            <div className="h-[calc(100vh-72px)] flex flex-col justify-between overflow-y-auto">
              <section className="flex flex-col h-full gap-6 pt-16 text-white items-center justify-center">
                {/* Links----------------------------------------------------------------------- */}
                {/* Using SheetClose around our links means that if any link is clicked, close the sheet */}
                {/* Features */}
                <SheetClose asChild>
                  <Link href="/">
                    <p className="font-semibold">Features</p>
                  </Link>
                </SheetClose>
                {/* About */}
                <SheetClose asChild>
                  <Link href="/">
                    <p className="font-semibold">About</p>
                  </Link>
                </SheetClose>
                {/* User Links */}
                <span className="text-lg">
                  <SignedIn>
                    {/* Only show if signed in */}
                    <Link href="/dashboard">Dashboard</Link>
                  </SignedIn>
                  <SignedOut>
                    {/* Only show if signed out */}
                    <SignInButton>Login</SignInButton>
                  </SignedOut>
                </span>
                {/* ---------------------------------------------------------------------------- */}
              </section>
            </div>
            {/* -------------------------------------------------------------------------------- */}
          </SheetContent>
          {/* ---------------------------------------------------------------------------------- */}
        </Sheet>
      </div>
      {/* -------------------------------------------------------------------------------------- */}
    </header>
  );
};

export default MobileNavBar;
