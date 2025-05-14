import React, { PropsWithChildren } from "react";

export const PageWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};
