import { useTheoryStore } from "@/entities/theory-card";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Award,
  Calendar,
  Clock,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";

interface AchievementStatsProps {
  className?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const AchievementStats: React.FC<AchievementStatsProps> = observer(
  ({ className = "" }) => {
    const theoryStore = useTheoryStore();

    // Мокап данных достижений
    const achievements: Achievement[] = [
      {
        id: "first_card",
        title: "Первые шаги",
        description: "Решите первую карточку",
        icon: Star,
        progress: theoryStore.solvedCardsCount > 0 ? 1 : 0,
        maxProgress: 1,
        isCompleted: theoryStore.solvedCardsCount > 0,
        rarity: "common",
      },
      {
        id: "ten_cards",
        title: "Начинающий",
        description: "Решите 10 карточек",
        icon: Target,
        progress: Math.min(theoryStore.solvedCardsCount, 10),
        maxProgress: 10,
        isCompleted: theoryStore.solvedCardsCount >= 10,
        rarity: "common",
      },
      {
        id: "fifty_cards",
        title: "Знаток",
        description: "Решите 50 карточек",
        icon: Award,
        progress: Math.min(theoryStore.solvedCardsCount, 50),
        maxProgress: 50,
        isCompleted: theoryStore.solvedCardsCount >= 50,
        rarity: "rare",
      },
      {
        id: "hundred_cards",
        title: "Эксперт",
        description: "Решите 100 карточек",
        icon: Trophy,
        progress: Math.min(theoryStore.solvedCardsCount, 100),
        maxProgress: 100,
        isCompleted: theoryStore.solvedCardsCount >= 100,
        rarity: "epic",
      },
      {
        id: "perfect_week",
        title: "Идеальная неделя",
        description: "Изучайте карточки 7 дней подряд",
        icon: Clock,
        progress: 5, // Мокап
        maxProgress: 7,
        isCompleted: false,
        rarity: "rare",
      },
      {
        id: "speed_demon",
        title: "Скоростной демон",
        description: "Решите 20 карточек за день",
        icon: Zap,
        progress: 12, // Мокап
        maxProgress: 20,
        isCompleted: false,
        rarity: "epic",
      },
    ];

    const getRarityColor = (rarity: Achievement["rarity"]) => {
      switch (rarity) {
        case "common":
          return "bg-gray-100 text-gray-800 border-gray-300";
        case "rare":
          return "bg-blue-100 text-blue-800 border-blue-300";
        case "epic":
          return "bg-purple-100 text-purple-800 border-purple-300";
        case "legendary":
          return "bg-yellow-100 text-yellow-800 border-yellow-300";
        default:
          return "bg-gray-100 text-gray-800 border-gray-300";
      }
    };

    const getRarityLabel = (rarity: Achievement["rarity"]) => {
      switch (rarity) {
        case "common":
          return "Обычное";
        case "rare":
          return "Редкое";
        case "epic":
          return "Эпическое";
        case "legendary":
          return "Легендарное";
        default:
          return "Обычное";
      }
    };

    const completedAchievements = achievements.filter((a) => a.isCompleted);
    const totalAchievements = achievements.length;

    // Статистика активности
    const activityStats = [
      {
        icon: Calendar,
        label: "Дней изучения",
        value: "15", // Мокап
        description: "За последний месяц",
        color: "text-blue-600",
      },
      {
        icon: Clock,
        label: "Время изучения",
        value: "24ч", // Мокап
        description: "Всего потрачено",
        color: "text-green-600",
      },
      {
        icon: Clock,
        label: "Текущая серия",
        value: "5", // Мокап
        description: "Дней подряд",
        color: "text-orange-600",
      },
      {
        icon: Zap,
        label: "Лучший день",
        value: "18", // Мокап
        description: "Карточек за день",
        color: "text-purple-600",
      },
    ];

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Общая статистика достижений */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Достижения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">
                  {completedAchievements.length}/{totalAchievements}
                </div>
                <div className="text-sm text-muted-foreground">
                  Получено достижений
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">
                  {Math.round(
                    (completedAchievements.length / totalAchievements) * 100
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Прогресс</div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(completedAchievements.length / totalAchievements) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Список достижений */}
        <Card>
          <CardHeader>
            <CardTitle>Все достижения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const progressPercentage =
                  (achievement.progress / achievement.maxProgress) * 100;

                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.isCompleted
                        ? "bg-green-50 border-green-200"
                        : "bg-muted/30 border-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.isCompleted ? "bg-green-100" : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            achievement.isCompleted
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRarityColor(
                              achievement.rarity
                            )}`}
                          >
                            {getRarityLabel(achievement.rarity)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                            <span>{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div
                              className="bg-primary h-1 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Статистика активности */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Статистика активности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activityStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);
