import Image from "next/image";
import { FC } from "react";

interface IProps {
  width?: number;
}

export const BrandLogo: FC<IProps> = ({ width }) => {
  return (
    <span className="flex items-center gap-2 font-semibold flex-shrink-0 text-lg">
      <Image src="/logo.png" alt="Logo" width={width || 148} height={32} />
    </span>
  );
};
