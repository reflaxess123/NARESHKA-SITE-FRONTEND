import { RegisterForm } from "@/features";
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

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>
            Создайте новый аккаунт, указав свой email и пароль.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="text-sm">
          <p>
            Уже есть аккаунт?
            <Link to={APP_ROUTES.LOGIN.path} className="ml-1 underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
