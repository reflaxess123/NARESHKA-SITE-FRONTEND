import { RegisterForm } from "@/features";
import { APP_ROUTES } from "@/shared";
import { Card } from "@/shared/ui";
import { Title, Text, Center } from "@mantine/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

export const RegisterPage: React.FC = () => {
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
            Регистрация
          </Title>
          <Text c="dimmed" ta="center" mt="xs">
            Создайте новый аккаунт, указав свой email и пароль.
          </Text>
        </Card.Section>
        <Card.Section inheritPadding py="lg">
          <RegisterForm />
        </Card.Section>
        <Card.Section
          inheritPadding
          py="lg"
          style={{ borderTop: "1px solid var(--mantine-color-divider)" }}
        >
          <Text size="sm" ta="center">
            Уже есть аккаунт?
            <RouterLink
              to={APP_ROUTES.LOGIN.path}
              style={{ marginLeft: "4px", textDecoration: "underline" }}
            >
              Войти
            </RouterLink>
          </Text>
        </Card.Section>
      </Card.Root>
    </Center>
  );
};
