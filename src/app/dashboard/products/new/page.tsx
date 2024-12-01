import React from "react";
import PageWithBackButton from "../../_components/PageWithBackButton";

const NewProductPage = () => {
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="New Product"
    >
      Inner
    </PageWithBackButton>
  );
};

export default NewProductPage;
