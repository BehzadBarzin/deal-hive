import { FC, ReactNode } from "react";
import DashboardNavBar from "./_components/NavBar";
import DashboardMobileNavBar from "./_components/MobileNavBar";

interface IProps {
  children: ReactNode;
}

const DashboardLayout: FC<IProps> = ({ children }) => {
  return (
    <div className="bg-accent/5 min-h-screen">
      <DashboardNavBar />
      <DashboardMobileNavBar />
      <div className="container py-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
