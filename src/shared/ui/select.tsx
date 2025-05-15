import {
  Select as MantineSelect,
  SelectProps as MantineSelectProps,
} from "@mantine/core";
import React from "react";

export interface SelectProps extends MantineSelectProps {}

const Select: React.FC<SelectProps> = (props) => {
  return <MantineSelect {...props} />;
};

export { Select };
