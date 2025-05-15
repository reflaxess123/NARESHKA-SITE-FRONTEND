import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useLogoutMutation, useSessionStore } from "@/entities/session";
import { APP_ROUTES, PageWrapper } from "@/shared";
import { Sidebar, SidebarBody, SidebarLink } from "@/shared/ui/sidebar";
import { Home, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const AppLayoutInternal: React.FC = () => {
  const sessionStore = useSessionStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate(APP_ROUTES.LOGIN.path, { replace: true });
    },
    onError: (error) => {
      alert(error.message || "Не удалось выйти. Попробуйте снова.");
    },
  });

  const handleLogout = () => {
    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
    }
  };

  if (!sessionStore.isAuthenticated || sessionStore.isSessionLoading) {
    return <Outlet />;
  }

  if (!sessionStore.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Ошибка: данные пользователя не загружены.</p>
      </div>
    );
  }

  const links = [
    {
      label: "Главная",
      href: APP_ROUTES.HOME.path,
      icon: (
        <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Нарешка",
      href: APP_ROUTES.NARESHKA.path,
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const profileLinkData = {
    label: sessionStore.currentUser?.email || "Профиль",
    href: APP_ROUTES.PROFILE.path,
    icon: (
      <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  };

  // Определение logoutLinkData внутри рендера, чтобы label был реактивным
  const logoutLinkData = {
    label: logoutMutation.isPending ? "Выход..." : "Выйти",
    href: "#", // Фиктивный href
    icon: (
      <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-200 dark:bg-neutral-900 w-full flex-1 min-h-screen"
      )}
    >
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="flex-col justify-between">
          <div className="flex-grow overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2 px-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 px-2 pb-2">
            <SidebarLink link={profileLinkData} />
            <SidebarLink
              link={logoutLinkData}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleLogout();
              }}
              // Добавляем классы для визуального отображения состояния disabled
              className={
                logoutMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
              }
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col overflow-y-auto p-2 md:p-10">
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </div>
    </div>
  );
};

export const AppLayout = observer(AppLayoutInternal);
