"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/server/actions/products";
import { FC, useTransition } from "react";

interface IProps {
  id: string;
}

const DeleteProductAlertDialogContent: FC<IProps> = ({ id }) => {
  // -----------------------------------------------------------------------------------------------
  // useTransition is used to handle the delete request (calling server action)
  const [isDeletePending, startDeleteTransition] = useTransition();
  // -----------------------------------------------------------------------------------------------
  const { toast } = useToast();
  // -----------------------------------------------------------------------------------------------
  return (
    <AlertDialogContent>
      {/* Alert Dialog Header */}
      <AlertDialogHeader>
        {/* Alert Dialog Title */}
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        {/* Alert Dialog Description */}
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      {/* Alert Dialog Footer */}
      <AlertDialogFooter>
        {/* Alert Dialog Cancel Button */}
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        {/* Alert Dialog Action Button */}
        <AlertDialogAction
          onClick={() => {
            // Call server action within a transition
            startDeleteTransition(async () => {
              // Server Action
              const data = await deleteProduct(id);
              // Handle response
              if (data.message) {
                toast({
                  title: data.error ? "Error" : "Success",
                  description: data.message,
                  variant: data.error ? "destructive" : "default",
                });
              }
            });
          }}
          disabled={isDeletePending} // Disable button while transition is pending
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteProductAlertDialogContent;
