import { useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button, Card, PageWrapper } from "@/shared/ui";
import { Title, Text, Stack, Group } from "@mantine/core";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfilePageInternal: React.FC = observer(() => {
  const sessionStore = useSessionStore();

  if (!sessionStore.currentUser) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Text>Загрузка данных пользователя или ошибка...</Text>
      </div>
    );
  }

  const { currentUser } = sessionStore;

  return (
    <PageWrapper>
      <Stack>
        <Group justify="flex-start">
          <Button
            variant="outline"
            component={Link}
            to={APP_ROUTES.HOME.path}
            title="Назад"
          >
            <ArrowLeft />
          </Button>
        </Group>
        <Group justify="center" pt={128}>
          <Card.Root
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: "100%", maxWidth: "448px" }}
          >
            <Card.Section inheritPadding py="md">
              <Title order={2}>Профиль пользователя</Title>
              <Text c="dimmed">Это ваша защищенная страница профиля.</Text>
            </Card.Section>
            <Card.Section inheritPadding py="md">
              <Stack gap="sm">
                <Text>
                  <Text span fw={600}>
                    ID:
                  </Text>{" "}
                  {currentUser.id}
                </Text>
                <Text>
                  <Text span fw={600}>
                    Email:
                  </Text>{" "}
                  {currentUser.email}
                </Text>
                <Text>
                  <Text span fw={600}>
                    Дата регистрации:
                  </Text>{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
            </Card.Section>
          </Card.Root>
        </Group>
      </Stack>
    </PageWrapper>
  );
});

export const ProfilePage = ProfilePageInternal;
