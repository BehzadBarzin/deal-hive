import { FC } from "react";
import { TProductsGridItem } from "./ProductGrid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteProductAlertDialogContent from "./DeleteProductAlertDialogContent";
import AddToSiteProductDialogContent from "./AddToSiteProductDialogContent";

interface IProps {
  product: TProductsGridItem;
}

const ProductCard: FC<IProps> = ({ product }) => {
  const { id, name, url, description } = product;
  return (
    <Card>
      {/* Card Header--------------------------------------------------------------------------- */}
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          {/* Card Title------------------------------------------------------------------------ */}
          <CardTitle>
            <Link href={`/dashboard/products/${id}/edit`}>{name}</Link>
          </CardTitle>
          {/* Dialog---------------------------------------------------------------------------- */}
          {/* Menu Button (...) */}
          {/* Menu Is a drop-down, but 2 of its children open dialog and alert dialogs, so we need to wrap it with both */}
          {/* Dialog: When Add To Site Menu is Clicked */}
          <Dialog>
            {/* Alert Dialog: When Delete Menu is Clicked */}
            <AlertDialog>
              <DropdownMenu>
                {/* Drop Down Menu Trigger */}
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="size-8 p-0">
                    {/* Screen Reader Only */}
                    <div className="sr-only">Action Menu</div>{" "}
                    <DotsHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                {/* Drop Down Menu Items */}
                <DropdownMenuContent>
                  {/* Edit Menu Item */}
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  {/* Dialog Trigger: Add To Site Menu Item */}
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Add To Site</DropdownMenuItem>
                  </DialogTrigger>
                  {/* Menu Separator */}
                  <DropdownMenuSeparator />
                  {/* Alert Dialog Trigger / Delete Menu Item */}
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Alert Dialog Content: When Delete Menu is Clicked */}
              <DeleteProductAlertDialogContent id={id} />
            </AlertDialog>
            {/* Dialog Content: When Add To Site Menu is Clicked */}
            <AddToSiteProductDialogContent id={id} />
          </Dialog>
        </div>
        {/* Card Description (Product URL)-------------------------------------------------------*/}
        <CardDescription>{url}</CardDescription>
      </CardHeader>
      {/* Card Content (Product Description----------------------------------------------------- */}
      {description && <CardContent>{description}</CardContent>}
    </Card>
  );
};

export default ProductCard;
