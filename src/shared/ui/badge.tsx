import {
  Badge as MantineBadge,
  BadgeProps as MantineBadgeProps,
} from "@mantine/core";
import React from "react";

export interface BadgeProps extends MantineBadgeProps {}

const Badge: React.FC<BadgeProps> = (props) => {
  return <MantineBadge {...props} />;
};

export { Badge };
