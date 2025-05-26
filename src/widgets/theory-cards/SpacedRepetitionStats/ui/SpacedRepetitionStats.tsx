import { GeneralStats } from "@/entities/theory-card";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Clock, RotateCcw, Target, TrendingUp } from "lucide-react";
import React from "react";

interface SpacedRepetitionStatsProps {
  stats: GeneralStats;
  dueCount: number;
  overdueCount: number;
}

export const SpacedRepetitionStats: React.FC<SpacedRepetitionStatsProps> = ({
  stats,
  dueCount,
  overdueCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium">К повторению</span>
          </div>
          <div className="text-2xl font-bold">{dueCount}</div>
          {overdueCount > 0 && (
            <Badge variant="destructive" className="text-xs mt-1">
              {overdueCount} просрочено
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Новые</span>
          </div>
          <div className="text-2xl font-bold">{stats.new}</div>
          <div className="text-xs text-muted-foreground">карточек</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Изучается</span>
          </div>
          <div className="text-2xl font-bold">{stats.learning}</div>
          <div className="text-xs text-muted-foreground">карточек</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">На повторении</span>
          </div>
          <div className="text-2xl font-bold">{stats.review}</div>
          <div className="text-xs text-muted-foreground">карточек</div>
        </CardContent>
      </Card>
    </div>
  );
};
