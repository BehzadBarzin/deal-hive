import { BrandLogo } from "@/components/BrandLogo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavBar = () => {
  return (
    <header className="max-sm:hidden flex py-6 shadow-md fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link className="text-lg" href="#">
          Features
        </Link>
        <Link className="text-lg" href="/#pricing">
          Pricing
        </Link>
        <Link className="text-lg" href="#">
          About
        </Link>
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
        <SignedIn>
          {/* Only show if signed in */}
          {/* User Button */}
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
};

export default NavBar;
