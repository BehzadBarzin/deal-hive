import { FC, ReactNode } from "react";
import NavBar from "./_components/NavBar";

interface IProps {
  children: ReactNode;
}

const MarketingLayout: FC<IProps> = ({ children }) => {
  return (
    <div className="selection:bg-[hsl(320,65%,52%,20%)]">
      <NavBar />
      {children}
    </div>
  );
};

export default MarketingLayout;