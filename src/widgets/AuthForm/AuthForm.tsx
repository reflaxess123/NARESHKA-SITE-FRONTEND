import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { login, register } from "@/entities/session/api/authApi"; // Импортируем API функции
import { useSessionStore } from "@/entities/session"; // Импортируем useSessionStore
import { BorderBeam } from "@/components/magicui/border-beam"; // Импортируем BorderBeam

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionStore = useSessionStore();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password });
      await sessionStore.checkAuthStatus(); // Обновляем состояние сессии
      // Перенаправление произойдет автоматически благодаря изменениям в HomePage и ProtectedRoute
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await register({ email, password });
      // После успешной регистрации обычно следует автоматический логин или запрос на подтверждение email
      // Для простоты, здесь мы просто пытаемся залогиниться с теми же данными
      // В реальном приложении это может быть другой флоу (например, бэкенд сразу создает сессию)
      await login({ email, password });
      await sessionStore.checkAuthStatus(); // Обновляем состояние сессии
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative w-[350px] overflow-hidden dark:border-gray-800 dark:bg-gray-950">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account."
            : "Create a new account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="dark:border-gray-800 dark:bg-gray-950"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="dark:border-gray-800 dark:bg-gray-950"
              />
            </div>
            {mode === "register" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {mode === "login" ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setMode("register");
                setError(null); // Сбрасываем ошибку при смене режима
              }}
              disabled={isLoading}
            >
              Register
            </Button>
            <Button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setMode("login");
                setError(null); // Сбрасываем ошибку при смене режима
              }}
              disabled={isLoading}
            >
              Login
            </Button>
            <Button onClick={handleRegister} disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </>
        )}
      </CardFooter>
      <BorderBeam duration={8} size={100} /> {/* Используем BorderBeam */}
    </Card>
  );
}
