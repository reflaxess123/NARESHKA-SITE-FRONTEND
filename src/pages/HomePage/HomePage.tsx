import { useLogoutMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES } from "@/shared";
import { Button, PageWrapper } from "@/shared/ui";
import { Title, Text, Group, Stack, Center, Flex } from "@mantine/core";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ThemeToggler } from "@/features/theme-toggler";
import { notifications } from "@mantine/notifications";

const HomePageInternal: React.FC = observer(() => {
  const sessionStore = useSessionStore();
  const navigate = useNavigate();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate(APP_ROUTES.LOGIN.path, { replace: true });
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка выхода",
        message: error.message || "Не удалось выйти. Попробуйте снова.",
        color: "red",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!sessionStore.currentUser) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Text>Ошибка: пользователь не найден, хотя сессия активна.</Text>
      </Center>
    );
  }

  return (
    <PageWrapper>
      <Flex
        p="md"
        justify="space-between"
        align="center"
        style={{ borderBottom: "1px solid var(--mantine-color-divider)" }}
      >
        <ThemeToggler />

        <Group gap="sm">
          {sessionStore.isAuthenticated ? (
            <>
              <Button
                component={RouterLink}
                to={APP_ROUTES.HOME.path}
                variant="subtle"
              >
                Главная
              </Button>
              <Button
                component={RouterLink}
                to={APP_ROUTES.NARESHKA.path}
                variant="subtle"
              >
                Нарешка
              </Button>
              <Button
                component={RouterLink}
                to={APP_ROUTES.PROFILE.path}
                variant="subtle"
              >
                Профиль ({sessionStore.currentUser?.email})
              </Button>
              <Button
                onClick={handleLogout}
                variant="filled"
                loading={logoutMutation.isPending}
                color="red"
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              {!sessionStore.isSessionLoading && (
                <>
                  {/* Обертка React.Fragment для двух кнопок */}
                  <Button
                    component={RouterLink}
                    to={APP_ROUTES.LOGIN.path}
                    variant="subtle"
                  >
                    Вход
                  </Button>
                  <Button
                    component={RouterLink}
                    to={APP_ROUTES.REGISTER.path}
                    variant="subtle"
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </>
          )}
        </Group>
      </Flex>
      <Stack
        align="center"
        justify="center"
        style={{ paddingTop: "16rem", textAlign: "center" }}
      >
        <Title order={1} mb="lg">
          Добро пожаловать, {sessionStore.currentUser.email}!
        </Title>
        <Text size="lg" mb="xl">
          Вы успешно вошли в систему. Ваш профиль и опция выхода доступны в
          панели навигации.
        </Text>
      </Stack>
    </PageWrapper>
  );
});

export const HomePage = HomePageInternal;
