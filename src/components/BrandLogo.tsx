import Image from "next/image";

export function BrandLogo() {
  return (
    <span className="flex items-center gap-2 font-semibold flex-shrink-0 text-lg">
      <Image src="/logo.png" alt="Logo" width={148} height={32} />
    </span>
  );
}
