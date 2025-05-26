import { useSessionStore } from "@/entities/session";
import { useTheoryStore } from "@/entities/theory-card";
import {
  fetchGeneralStats,
  spacedRepetitionKeys,
} from "@/entities/theory-card/api/spacedRepetitionApi";
import { PageWrapper } from "@/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { AchievementStats } from "@/widgets/profile/AchievementStats/ui/AchievementStats";
import { ProgressCharts } from "@/widgets/profile/ProgressCharts/ui/ProgressCharts";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

const ProfilePageInternal: React.FC = () => {
  const sessionStore = useSessionStore();
  const theoryStore = useTheoryStore();

  // Запрос общей статистики интервального повторения
  const { data: generalStats } = useQuery({
    queryKey: spacedRepetitionKeys.generalStats(),
    queryFn: fetchGeneralStats,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Обновляем store при получении статистики
  useEffect(() => {
    if (generalStats) {
      theoryStore.setGeneralStats(generalStats);
    }
  }, [generalStats, theoryStore]);

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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Заголовок профиля */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Профиль пользователя</h1>
          <p className="text-muted-foreground">
            Добро пожаловать, {currentUser.email}!
          </p>
        </div>

        {/* Основная информация */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Основная информация</CardTitle>
            <CardDescription>Ваши данные и дата регистрации</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">ID:</span>
              <span className="text-muted-foreground">{currentUser.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span className="text-muted-foreground">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Дата регистрации:</span>
              <span className="text-muted-foreground">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Достижения и статистика */}
        <AchievementStats />

        {/* Графики прогресса */}
        <ProgressCharts />
      </div>
    </PageWrapper>
  );
};

export const ProfilePage = observer(ProfilePageInternal);
