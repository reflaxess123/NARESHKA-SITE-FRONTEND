import { LoginForm } from "@/features";
import { APP_ROUTES } from "@/shared";
import { Card } from "@/shared/ui";
import { Title, Text, Center } from "@mantine/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

export const LoginPage: React.FC = () => {
  return (
    <Center style={{ minHeight: "100vh" }}>
      <Card.Root
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Section inheritPadding py="lg">
          <Title order={2} ta="center">
            Вход
          </Title>
          <Text c="dimmed" ta="center" mt="xs">
            Введите свой email и пароль для входа в аккаунт.
          </Text>
        </Card.Section>
        <Card.Section inheritPadding py="lg">
          <LoginForm />
        </Card.Section>
        <Card.Section
          inheritPadding
          py="lg"
          style={{ borderTop: "1px solid var(--mantine-color-divider)" }}
        >
          <Text size="sm" ta="center">
            Нет аккаунта?
            <RouterLink
              to={APP_ROUTES.REGISTER.path}
              style={{ marginLeft: "4px", textDecoration: "underline" }}
            >
              Зарегистрироваться
            </RouterLink>
          </Text>
        </Card.Section>
      </Card.Root>
    </Center>
  );
};
