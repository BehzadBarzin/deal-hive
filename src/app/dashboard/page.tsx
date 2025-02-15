import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "./_components/NoProducts";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "./_components/ProductGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByDayChartData,
} from "@/server/db/productViews";
import { ViewsByDayChart } from "./_components/charts/ViewsByDayChart";
import { HasPermission } from "@/components/HasPermission";
import { canAccessAnalytics } from "@/server/permissions";

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
        <Link
          className="group flex gap-2 items-center hover:underline"
          href="/dashboard/products"
        >
          Products
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </h2>
      <ProductGrid products={products} />
      <h2 className="mb-6 text-3xl font-semibold flex justify-between mt-12">
        <Link
          href="/dashboard/analytics"
          className="flex gap-2 items-center hover:underline group"
        >
          Analytics
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </h2>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <AnalyticsChart userId={userId} />
      </HasPermission>
    </>
  );
};

export default DashboardPage;

// =================================================================================================
async function AnalyticsChart({ userId }: { userId: string }) {
  const chartData = await getViewsByDayChartData({
    userId,
    interval: CHART_INTERVALS.last30Days,
    timezone: "UTC",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
