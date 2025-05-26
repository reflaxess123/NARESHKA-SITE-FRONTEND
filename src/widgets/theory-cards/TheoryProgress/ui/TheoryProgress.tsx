import { useTheoryStore } from "@/entities/theory-card";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { BookOpen, CheckCircle, Target, TrendingUp } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";

interface TheoryProgressProps {
  className?: string;
}

export const TheoryProgress: React.FC<TheoryProgressProps> = observer(
  ({ className = "" }) => {
    const theoryStore = useTheoryStore();

    const progressPercentage =
      theoryStore.totalItems > 0
        ? Math.round(
            (theoryStore.solvedCardsCount / theoryStore.totalItems) * 100
          )
        : 0;

    const stats = [
      {
        icon: BookOpen,
        label: "Всего карточек",
        value: theoryStore.totalItems,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        icon: CheckCircle,
        label: "Изучено",
        value: theoryStore.solvedCardsCount,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        icon: TrendingUp,
        label: "Средний балл",
        value: theoryStore.averageSolvedCount,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        icon: Target,
        label: "Прогресс",
        value: `${progressPercentage}%`,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];

    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">Ваш прогресс</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Прогресс-бар */}
          {theoryStore.totalItems > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Общий прогресс изучения
                </span>
                <span className="text-sm font-medium">
                  {theoryStore.solvedCardsCount} из {theoryStore.totalItems}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Мотивационное сообщение */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              {progressPercentage === 0 && "Начните изучение карточек! 🚀"}
              {progressPercentage > 0 &&
                progressPercentage < 25 &&
                "Отличное начало! Продолжайте в том же духе! 💪"}
              {progressPercentage >= 25 &&
                progressPercentage < 50 &&
                "Вы на правильном пути! 🎯"}
              {progressPercentage >= 50 &&
                progressPercentage < 75 &&
                "Больше половины пути пройдено! 🔥"}
              {progressPercentage >= 75 &&
                progressPercentage < 100 &&
                "Почти у цели! Осталось совсем немного! ⭐"}
              {progressPercentage === 100 &&
                "Поздравляем! Все карточки изучены! 🎉"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);
