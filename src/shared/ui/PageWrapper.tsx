import React, { PropsWithChildren } from "react";

export const PageWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-32">{children}</div>;
};
