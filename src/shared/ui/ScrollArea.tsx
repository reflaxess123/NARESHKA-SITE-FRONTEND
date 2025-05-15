import {
  ScrollArea as MantineScrollArea,
  ScrollAreaProps as MantineScrollAreaProps,
} from "@mantine/core";
import React from "react";

export interface ScrollAreaProps extends MantineScrollAreaProps {}

const ScrollArea: React.FC<ScrollAreaProps> = (props) => {
  return <MantineScrollArea {...props} />;
};

export { ScrollArea };
