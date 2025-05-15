import { Container, ContainerProps } from "@mantine/core";
import React from "react";

export interface PageWrapperProps extends Omit<ContainerProps, "children"> {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, ...rest }) => {
  // Можно добавить стандартные отступы или другие свойства по умолчанию
  return (
    <Container fluid py="md" {...rest}>
      {children}
    </Container>
  );
};

export { PageWrapper };
