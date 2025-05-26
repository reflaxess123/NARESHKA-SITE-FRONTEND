import {
  fetchCardIntervals,
  fetchDueCards,
  fetchGeneralStats,
  Rating,
  reviewCard,
  spacedRepetitionKeys,
  useTheoryStore,
} from "@/entities/theory-card";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { SpacedRepetitionCard } from "@/widgets/theory-cards/SpacedRepetitionCard";
import { SpacedRepetitionStats } from "@/widgets/theory-cards/SpacedRepetitionStats";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const TheoryReviewPage: React.FC = observer(() => {
  const theoryStore = useTheoryStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Запрос карточек к повторению (включая новые карточки)
  const {
    data: dueCards = [],
    isLoading: isDueCardsLoading,
    error: dueCardsError,
    refetch: refetchDueCards,
  } = useQuery({
    queryKey: spacedRepetitionKeys.dueCards({
      limit: 20,
      includeNew: true,
      includeLearning: true,
      includeReview: true,
    }),
    queryFn: () =>
      fetchDueCards({
        limit: 20,
        includeNew: true,
        includeLearning: true,
        includeReview: true,
      }),
    staleTime: 1 * 60 * 1000, // 1 минута
  });

  // Отладочная информация
  console.log("Due cards data:", dueCards);
  console.log("Due cards loading:", isDueCardsLoading);
  console.log("Due cards error:", dueCardsError);

  // Запрос общей статистики
  const {
    data: generalStats,
    error: statsError,
    isLoading: isStatsLoading,
  } = useQuery({
    queryKey: spacedRepetitionKeys.generalStats(),
    queryFn: fetchGeneralStats,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Отладочная информация для статистики
  console.log("General stats data:", generalStats);
  console.log("General stats loading:", isStatsLoading);
  console.log("General stats error:", statsError);

  // Запрос интервалов для текущей карточки
  const currentCard = dueCards[currentCardIndex];
  const { data: intervals } = useQuery({
    queryKey: spacedRepetitionKeys.cardIntervals(currentCard?.id || ""),
    queryFn: () => fetchCardIntervals(currentCard!.id),
    enabled: !!currentCard,
    staleTime: 30 * 1000, // 30 секунд
  });

  // Мутация для повторения карточки
  const reviewMutation = useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string; rating: Rating }) =>
      reviewCard(cardId, { rating }),
    onSuccess: (data, variables) => {
      // Обновляем локальное состояние
      theoryStore.updateCardAfterReview(variables.cardId, data);

      // Переходим к следующей карточке
      if (currentCardIndex < dueCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // Если карточки закончились, обновляем список
        refetchDueCards();
        setCurrentCardIndex(0);
      }

      // Инвалидируем кэш
      queryClient.invalidateQueries({
        queryKey: spacedRepetitionKeys.dueCards(),
      });
      queryClient.invalidateQueries({
        queryKey: spacedRepetitionKeys.generalStats(),
      });
    },
    onError: (error) => {
      console.error("Ошибка повторения карточки:", error);
      theoryStore.setError("Не удалось сохранить результат повторения");
    },
  });

  // Обновляем store при получении данных
  useEffect(() => {
    if (dueCards) {
      theoryStore.setDueCards(dueCards);
    }
  }, [dueCards, theoryStore]);

  useEffect(() => {
    if (generalStats) {
      theoryStore.setGeneralStats(generalStats);
    }
  }, [generalStats, theoryStore]);

  const handleReview = (rating: Rating) => {
    if (currentCard) {
      reviewMutation.mutate({ cardId: currentCard.id, rating });
    }
  };

  const handleBackToTheory = () => {
    navigate("/theory");
  };

  const handleMigration = async () => {
    try {
      console.log("Миграция карточек временно недоступна");
      alert(
        "Миграция карточек временно недоступна. Обратитесь к разработчику для настройки бэкенда."
      );
    } catch (error) {
      console.error("Ошибка миграции карточек:", error);
      theoryStore.setError("Не удалось выполнить миграцию карточек");
    }
  };

  if (isDueCardsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Загрузка карточек к повторению...</span>
      </div>
    );
  }

  if (dueCardsError || statsError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToTheory}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к теории
          </Button>
          <h1 className="text-2xl font-bold">Интервальное повторение</h1>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <h2 className="text-xl font-semibold mb-2">Ошибка загрузки</h2>
              {dueCardsError && (
                <p className="text-sm mb-2">
                  Ошибка загрузки карточек: {dueCardsError.message}
                </p>
              )}
              {statsError && (
                <p className="text-sm mb-2">
                  Ошибка загрузки статистики: {statsError.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  refetchDueCards();
                  window.location.reload();
                }}
              >
                Попробовать снова
              </Button>
              <Button variant="outline" onClick={handleBackToTheory}>
                Назад к теории
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dueCards.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToTheory}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к теории
          </Button>
          <h1 className="text-2xl font-bold">Интервальное повторение</h1>
        </div>

        {generalStats && (
          <SpacedRepetitionStats
            stats={generalStats}
            dueCount={0}
            overdueCount={0}
          />
        )}

        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Система интервального повторения
            </h2>
            <p className="text-muted-foreground mb-4">
              {generalStats ? (
                <>
                  В системе найдено <strong>{generalStats.new}</strong> новых
                  карточек, но эндпоинт для получения карточек к повторению не
                  настроен на бэкенде.
                </>
              ) : (
                "Карточки к повторению не найдены."
              )}
            </p>
            <div className="space-y-3">
              <Button onClick={handleBackToTheory}>
                Перейти к свободному изучению
              </Button>
              <div className="text-sm text-muted-foreground">
                <strong>Для разработчика:</strong>
                <br />
                Необходимо реализовать эндпоинт{" "}
                <code>GET /api/theory/cards/due</code> на бэкенде
              </div>
              <Button variant="outline" onClick={handleMigration}>
                Попробовать миграцию
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={handleBackToTheory}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к теории
        </Button>
        <h1 className="text-2xl font-bold">Интервальное повторение</h1>
        <div className="text-sm text-muted-foreground">
          {currentCardIndex + 1} из {dueCards.length}
        </div>
      </div>

      {generalStats && (
        <SpacedRepetitionStats
          stats={generalStats}
          dueCount={dueCards.length}
          overdueCount={dueCards.filter((card) => card.isOverdue).length}
        />
      )}

      {currentCard && intervals && (
        <div className="flex justify-center">
          <SpacedRepetitionCard
            card={currentCard}
            intervals={intervals}
            onReview={handleReview}
            isLoading={reviewMutation.isPending}
            className="max-w-2xl"
          />
        </div>
      )}

      {/* Индикатор загрузки */}
      {reviewMutation.isPending && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Сохранение результата...</span>
          </div>
        </div>
      )}
    </div>
  );
});
