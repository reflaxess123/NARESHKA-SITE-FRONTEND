import {
  InputLabel as MantineInputLabel,
  InputLabelProps as MantineInputLabelProps,
} from "@mantine/core";
import React from "react";

// InputLabelProps уже включает `children` и другие необходимые атрибуты для label
export interface LabelProps extends MantineInputLabelProps {}

const Label: React.FC<LabelProps> = (props) => {
  return <MantineInputLabel {...props} />;
};

export { Label };
