"use server";

import { ProductDetails, productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
} from "../db/products";

// Server Action: Create Product In DB
export async function createProduct(
  unsafeData: ProductDetails
): Promise<{ error: boolean; message: string } | undefined> {
  // Get currently logged in user with Clerk
  const { userId } = await auth();

  // Parse form data using zod
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: "There was an error creating your product" };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

// -------------------------------------------------------------------------------------------------
// Server Action: Delete Product
export async function deleteProduct(id: string) {
  const { userId } = await auth();
  const errorMessage = "There was an error deleting your product";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteProductDb({ id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted your product" : errorMessage,
  };
}

// -------------------------------------------------------------------------------------------------
