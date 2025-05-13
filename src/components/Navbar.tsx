import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button"; // Предполагается, что Button находится здесь

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    } else {
      alert(result.message || "Не удалось выйти. Попробуйте снова.");
    }
  };

  return (
    <nav className="bg-gray-100 text-1xl text-black p-4 shadow-md pr-10">
      <div className="flex justify-end items-center gap-2">
        <Button asChild>
          <Link to="/" className="hover:text-gray-500">
            Главная
          </Link>
        </Button>
        {user ? (
          <>
            <Button asChild>
              <Link to="/profile" className="hover:text-gray-500">
                Профиль
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="hover:text-gray-500 text-black"
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button asChild>
              <Link to="/login" className="hover:text-gray-500">
                Вход
              </Link>
            </Button>
            <Button asChild>
              <Link to="/register" className="hover:text-gray-500">
                Регистрация
              </Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
