import {
  Modal as MantineModal,
  ModalProps as MantineModalProps,
} from "@mantine/core";
import React from "react";

export interface ModalProps extends MantineModalProps {}

// Компонент Modal принимает children, opened, onClose как основные пропсы.
// title также является важным пропом.
const Modal: React.FC<ModalProps> = (props) => {
  return <MantineModal {...props} />;
};

export { Modal };
