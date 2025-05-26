import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";
import React from "react";

interface StudyModeToggleProps {
  currentMode: "classic" | "spaced";
  onModeChange: (mode: "classic" | "spaced") => void;
  stats?: {
    classic: {
      totalCards: number;
      solvedCards: number;
    };
    spaced: {
      dueCards: number;
      newCards: number;
      learningCards: number;
      reviewCards: number;
    };
  };
}

export const StudyModeToggle: React.FC<StudyModeToggleProps> = ({
  currentMode,
  onModeChange,
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Классический режим */}
      <Card
        className={`cursor-pointer transition-all ${
          currentMode === "classic"
            ? "ring-2 ring-primary border-primary"
            : "hover:border-primary/50"
        }`}
        onClick={() => onModeChange("classic")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Свободное изучение</h3>
            </div>
            {currentMode === "classic" && (
              <Badge variant="default">Активен</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Изучайте карточки в любом порядке, используйте фильтры и поиск
          </p>
          {stats?.classic && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Всего: {stats.classic.totalCards}</span>
              <span>Решено: {stats.classic.solvedCards}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Режим интервального повторения */}
      <Card
        className={`cursor-pointer transition-all ${
          currentMode === "spaced"
            ? "ring-2 ring-primary border-primary"
            : "hover:border-primary/50"
        }`}
        onClick={() => onModeChange("spaced")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-medium">Интервальное повторение</h3>
            </div>
            {currentMode === "spaced" && (
              <Badge variant="default">Активен</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Оптимальное запоминание с помощью алгоритма интервального повторения
          </p>
          {stats?.spaced && (
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>К повторению: {stats.spaced.dueCards}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Новых: {stats.spaced.newCards}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
