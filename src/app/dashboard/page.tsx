import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "./_components/NoProducts";

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
  return <div>DashboardPage</div>;
};

export default DashboardPage;
