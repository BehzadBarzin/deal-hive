import { FC } from "react";
import ProductCard from "./ProductCard";

export type TProductsGridItem = {
  id: string;
  name: string;
  url: string;
  description?: string | null;
};

interface IProps {
  products: TProductsGridItem[];
}

const ProductGrid: FC<IProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product: TProductsGridItem) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
