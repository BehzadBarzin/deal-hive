import { FC } from "react";

interface IProps {
  children: React.ReactNode;
}

const AuthLayout: FC<IProps> = async ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
