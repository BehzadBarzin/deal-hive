import { Button } from "@/components/ui/button";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface IProps {
  backButtonHref: string;
  pageTitle: string;
  children: ReactNode;
}

const PageWithBackButton: FC<IProps> = ({
  backButtonHref,
  pageTitle,
  children,
}) => {
  return (
    // grid-cols-[auto,1fr]: 2 columns, first column takes as little space as possible, second one expands
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
      <Button size="icon" variant="outline" className="rounded-full" asChild>
        <Link href={backButtonHref}>
          {/* sr-only: Not Visible, Only for screen readers */}
          <div className="sr-only">Back</div>{" "}
          <CaretLeftIcon className="size-8" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold self-center">{pageTitle}</h1>
      {/* col-start-2: Start (place in) from the second column */}
      <div className="col-start-2">{children}</div>
    </div>
  );
};

export default PageWithBackButton;
