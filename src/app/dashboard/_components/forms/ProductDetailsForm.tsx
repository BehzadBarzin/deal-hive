"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { ProductDetails, productDetailsSchema } from "@/schemas/products";
import { createProduct, updateProduct } from "@/server/actions/products";
import { useToast } from "@/hooks/use-toast";

/**
 * We use `react-hook-form` to handle form validation, definition and submission
 * We use `zod` to define validation schema
 * We use `@hookform/resolvers/zod` to resolve form validation via zod schema for `react-hook-form`
 * -----
 * Then by calling useForm (from react-hook-form package) we get all the functions required to handle form validation submission
 * Also, when we wrap the form with a <Form> component (from shadcn) we get type-safe
 * form fields (all fields are controlled components and name property is type-safe)
 */

const ProductDetailsForm = ({
  product,
}: {
  product?: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) => {
  // -----------------------------------------------------------------------------------------------
  const form = useForm<ProductDetails>({
    resolver: zodResolver(productDetailsSchema),
    // When editing a product, a `product` prop would be passed to this component. So, we'll use its field values as initial form values.
    defaultValues: {
      name: product ? product.name : "",
      description: product ? product.description || "" : "",
      url: product ? product.url : "",
    },
  });
  // -----------------------------------------------------------------------------------------------
  // To display toast
  const { toast } = useToast();
  // -----------------------------------------------------------------------------------------------
  // Form submission function called by useForm's `handleSubmit` function which passes validated form data to it
  const onSubmit = async (data: ProductDetails) => {
    // Determine the action: create/edit
    const action = product
      ? updateProduct.bind(null, product.id)
      : createProduct;

    // Call server action to create/update product
    const response = await action(data);

    // If server action payload contains `message`
    if (response?.message) {
      toast({
        title: response.error ? "Error" : "Success",
        description: response.message,
        variant: response.error ? "destructive" : "default",
      });
    }
  };
  // -----------------------------------------------------------------------------------------------
  // Pass everything returned by `useForm` (`react-hook-form` package) to the `<Form>` (shadcn) component
  return (
    <Form {...form}>
      {/* `useForm` returns a `handleSubmit` function that validates the form then calls the `onSubmit` function that we passed to it */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ---------------------------------------------------------------------------------- */}
          {/* Product Name---------------------------------------------------------------------- */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Website URL----------------------------------------------------------------------- */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your website URL
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the protocol (http/https) and the full path to the
                  sales page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* ---------------------------------------------------------------------------------- */}
        </div>
        {/* Description------------------------------------------------------------------------- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                An optional description to help distinguish your product from
                other products
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button----------------------------------------------------------------------- */}
        {/* self-end → align-self: flex-end; */}
        <div className="self-end">
          {/* Use `useForm` form state to disable button if form is submitting */}
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
        {/* ------------------------------------------------------------------------------------ */}
      </form>
    </Form>
  );
};

export default ProductDetailsForm;
