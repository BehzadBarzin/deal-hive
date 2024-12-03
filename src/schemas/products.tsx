import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

// Zod Schema and Data Type for the form
// -------------------------------------------------------------------------------------------------
// Product Form
export const productDetailsSchema = z.object({
  name: z.string().min(1, "Required"),
  url: z.string().url().min(1, "Required").transform(removeTrailingSlash),
  description: z.string().optional(),
});

export type ProductDetails = z.infer<typeof productDetailsSchema>;

// -------------------------------------------------------------------------------------------------
