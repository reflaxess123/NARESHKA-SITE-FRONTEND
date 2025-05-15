import { Card, Skeleton } from "@/shared/ui";
import { Group, Divider } from "@mantine/core";
import React from "react";

export const ContentBlockCardSkeleton: React.FC = () => {
  return (
    <Card.Root shadow="sm" padding={0} radius="md" withBorder>
      <Card.Section inheritPadding py="md">
        <Skeleton height={24} width="75%" mb="sm" />
        <Skeleton height={16} width="50%" />
      </Card.Section>

      <Card.Section inheritPadding py="sm">
        <Skeleton height={16} mb={8} />
        <Skeleton height={16} mb={8} />
        <Skeleton height={16} width="83%" mb="md" />
        <Skeleton height={32} />
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="sm">
        <Group justify="space-between" w="100%" mb="sm">
          <Group gap="sm">
            <Skeleton height={24} width={80} />
            <Skeleton height={24} width={80} />
          </Group>
          <Skeleton height={16} width={64} /> {/* ID Placeholder */}
        </Group>
        <Group justify="space-between" w="100%" mt="xs">
          <Skeleton height={20} width={80} /> {/* Solved count placeholder */}
          <Group gap="xs">
            <Skeleton height={28} width={28} radius="sm" />{" "}
            {/* Decrement button placeholder */}
            <Skeleton height={28} width={28} radius="sm" />{" "}
            {/* Increment button placeholder */}
          </Group>
        </Group>
      </Card.Section>
    </Card.Root>
  );
};
