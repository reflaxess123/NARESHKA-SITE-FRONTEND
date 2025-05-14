import { useSessionStore } from "@/entities/session";
import { APP_ROUTES, PageWrapper } from "@/shared";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";

const ProfilePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();

  if (!sessionStore.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка данных пользователя или ошибка...</p>
      </div>
    );
  }

  const { currentUser } = sessionStore;

  return (
    <PageWrapper>
      <div className="flex flex-col">
        <Button variant="outline" className="w-[100px] ml-auto p-4">
          <Link to={APP_ROUTES.HOME.path}>Назад</Link>
        </Button>
        <div className="flex items-center justify-center pt-64">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Профиль пользователя</CardTitle>
              <CardDescription>
                Это ваша защищенная страница профиля.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {currentUser.id}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {currentUser.email}
                </p>
                <p>
                  <span className="font-semibold">Дата регистрации:</span>{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export const ProfilePage = observer(ProfilePageInternal);
