import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "./_components/NoProducts";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "./_components/ProductGrid";

const DashboardPage = async () => {
  // -----------------------------------------------------------------------------------------------
  // Get currently logged in user id
  const { userId, redirectToSignIn } = await auth();
  // If user is not signed in, redirect to sign-in page
  if (userId == null) {
    return redirectToSignIn();
  }
  // -----------------------------------------------------------------------------------------------
  // Get products
  const products = await getProducts(userId, { limit: 6 });

  if (products.length === 0) {
    return <NoProducts />;
  }
  // -----------------------------------------------------------------------------------------------
  return (
    <>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        {/* Link to Products page */}
        <Link
          href="/dashboard/products"
          className="group flex gap-2 items-center hover:underline"
        >
          Products{" "}
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
        {/* Add Product Button */}
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </h2>
      {/* Products Grid */}
      <ProductGrid products={products} />
    </>
  );
};

export default DashboardPage;
