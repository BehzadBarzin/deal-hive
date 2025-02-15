import React from "react";
import PageWithBackButton from "../../_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductDetailsForm from "../../_components/forms/ProductDetailsForm";
import { HasPermission } from "@/components/HasPermission";
import { canCreateProduct } from "@/server/permissions";

const NewProductPage = () => {
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="New Product"
    >
      <HasPermission
        permission={canCreateProduct}
        renderFallback
        fallbackText="You have already created the maximum number of products. Try upgrading your account to create more."
      >
        {/* -------------------------------------------------------------------------------------- */}
        <Card>
          {/* Card Header------------------------------------------------------------------------- */}
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          {/* Card Content------------------------------------------------------------------------ */}
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
      </HasPermission>
      {/* -------------------------------------------------------------------------------------- */}
    </PageWithBackButton>
  );
};

export default NewProductPage;
