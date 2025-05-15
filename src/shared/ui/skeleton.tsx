import {
  Skeleton as MantineSkeleton,
  SkeletonProps as MantineSkeletonProps,
} from "@mantine/core";
import React from "react";

export interface SkeletonProps extends MantineSkeletonProps {}

const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <MantineSkeleton {...props} />;
};

export { Skeleton };
