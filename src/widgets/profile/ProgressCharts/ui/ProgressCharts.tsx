import { useTheoryStore } from "@/entities/theory-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { observer } from "mobx-react-lite";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressChartsProps {
  className?: string;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = observer(
  ({ className = "" }) => {
    const theoryStore = useTheoryStore();

    // Данные для круговой диаграммы прогресса
    const progressData = [
      {
        name: "Изучено",
        value: theoryStore.solvedCardsCount,
        color: "hsl(var(--chart-1))",
      },
      {
        name: "Не изучено",
        value: theoryStore.totalItems - theoryStore.solvedCardsCount,
        color: "hsl(var(--chart-2))",
      },
    ];

    // Данные для статистики интервального повторения
    const spacedRepetitionData = [
      {
        name: "Новые",
        value: theoryStore.generalStats?.new || 0,
        color: "hsl(var(--chart-3))",
      },
      {
        name: "Изучается",
        value: theoryStore.generalStats?.learning || 0,
        color: "hsl(var(--chart-4))",
      },
      {
        name: "На повторении",
        value: theoryStore.generalStats?.review || 0,
        color: "hsl(var(--chart-5))",
      },
    ];

    // Данные для прогресса по времени (мокап данных)
    const timeProgressData = [
      { date: "Пн", solved: 5, total: 8 },
      { date: "Вт", solved: 12, total: 15 },
      { date: "Ср", solved: 8, total: 12 },
      { date: "Чт", solved: 15, total: 18 },
      { date: "Пт", solved: 20, total: 25 },
      { date: "Сб", solved: 18, total: 22 },
      { date: "Вс", solved: 10, total: 14 },
    ];

    // Данные для статистики по категориям (мокап)
    const categoryData = [
      { category: "JavaScript", solved: 45, total: 60 },
      { category: "React", solved: 32, total: 40 },
      { category: "TypeScript", solved: 28, total: 35 },
      { category: "Node.js", solved: 15, total: 25 },
      { category: "CSS", solved: 38, total: 50 },
    ];

    const progressPercentage =
      theoryStore.totalItems > 0
        ? Math.round(
            (theoryStore.solvedCardsCount / theoryStore.totalItems) * 100
          )
        : 0;

    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
        {/* Круговая диаграмма общего прогресса */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Общий прогресс изучения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} карточек`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <div className="text-3xl font-bold text-primary">
                {progressPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">
                {theoryStore.solvedCardsCount} из {theoryStore.totalItems}{" "}
                карточек
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика интервального повторения */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔄 Интервальное повторение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spacedRepetitionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value} карточек`]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {spacedRepetitionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Прогресс по времени */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Активность за неделю
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} карточек`,
                      name === "solved" ? "Решено" : "Всего",
                    ]}
                  />
                  <Legend
                    formatter={(value: string) =>
                      value === "solved" ? "Решено" : "Всего"
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="solved"
                    stackId="2"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Прогресс по категориям */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📚 Прогресс по категориям
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="horizontal"
                  margin={{ left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} карточек`,
                      name === "solved" ? "Изучено" : "Всего",
                    ]}
                  />
                  <Legend
                    formatter={(value: string) =>
                      value === "solved" ? "Изучено" : "Всего"
                    }
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="solved"
                    fill="hsl(var(--chart-1))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);
