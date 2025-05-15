import {
  TextInput as MantineTextInput,
  TextInputProps as MantineTextInputProps,
} from "@mantine/core";
import React from "react";

export interface InputProps extends MantineTextInputProps {}

const Input: React.FC<InputProps> = (props) => {
  return <MantineTextInput {...props} />;
};

export { Input };
