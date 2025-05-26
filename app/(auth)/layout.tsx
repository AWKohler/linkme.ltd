import React from "react";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <main className="h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-opacity-50"></div>
        {children}
    </main>
  );
}
 
export default AuthLayout;