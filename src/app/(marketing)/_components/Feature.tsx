import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
}

const Feature: FC<IProps> = ({ children, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
};

export default Feature;
