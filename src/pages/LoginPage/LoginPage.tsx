import { LoginForm } from "@/features";
import { APP_ROUTES } from "@/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import React from "react";
import { Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Вход</CardTitle>
            <CardDescription>
              Введите свой email и пароль для входа в аккаунт.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="text-sm">
            <p>
              Нет аккаунта?
              <Link to={APP_ROUTES.REGISTER.path} className="ml-1 underline">
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
