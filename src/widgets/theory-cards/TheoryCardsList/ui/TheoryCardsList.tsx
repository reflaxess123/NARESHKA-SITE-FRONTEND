import {
  TheoryCard,
  TheoryCardsApiResponse,
  TheoryFiltersParams,
  updateTheoryCardProgress,
  useTheoryStore,
} from "@/entities/theory-card";
import { useInfiniteTheoryCards } from "@/features";
import { Button } from "@/shared/ui/button";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FlippableCard } from "../../FlippableCard/ui/FlippableCard";

interface TheoryCardsListProps {
  filters: TheoryFiltersParams;
  onCardFlip?: (cardId: string) => void;
}

export const TheoryCardsList: React.FC<TheoryCardsListProps> = observer(
  ({ filters, onCardFlip }) => {
    const theoryStore = useTheoryStore();
    const queryClient = useQueryClient();

    // Запрос карточек с бесконечным скроллом
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
      error,
      refetch,
    } = useInfiniteTheoryCards({ ...filters, limit: filters.limit || 12 });

    const { ref, inView } = useInView({
      threshold: 0.5,
    });

    useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Получаем все карточки со всех страниц
    const typedData = data as InfiniteData<TheoryCardsApiResponse> | undefined;
    const allCardsFromPages: (TheoryCard & { pageIndex: number })[] =
      typedData?.pages.flatMap((page: TheoryCardsApiResponse, index: number) =>
        page.data.map((card) => ({ ...card, pageIndex: index }))
      ) || [];

    // Удаляем дубликаты по id, сохраняя первый встреченный элемент
    const processedCards = Array.from(
      new Map(allCardsFromPages.map((item) => [item.id, item])).values()
    );

    // Мутация для обновления прогресса
    const progressMutation = useMutation({
      mutationFn: ({
        cardId,
        action,
      }: {
        cardId: string;
        action: "increment" | "decrement";
      }) => updateTheoryCardProgress(cardId, action),
      onSuccess: (_data, variables) => {
        // Обновляем локальное состояние
        theoryStore.updateCardProgress(variables.cardId, variables.action);
        // Инвалидируем кэш для обновления данных
        queryClient.invalidateQueries({
          queryKey: ["theoryCards"],
        });
      },
      onError: (error) => {
        console.error("Ошибка обновления прогресса:", error);
        theoryStore.setError("Не удалось обновить прогресс");
      },
    });

    // Обновляем store при получении данных
    useEffect(() => {
      if (typedData?.pages.length) {
        // Обновляем карточки в store для корректной работы прогресса
        theoryStore.setCards(processedCards);

        // Обновляем общую статистику из первой страницы
        const firstPage = typedData.pages[0];
        if (firstPage?.pagination) {
          theoryStore.setPagination(
            1, // Для бесконечного скролла всегда показываем как первую страницу
            firstPage.pagination.totalPages,
            firstPage.pagination.totalItems
          );
        }
        theoryStore.setError(null);
      }
    }, [typedData, processedCards, theoryStore]);

    // Обновляем состояние загрузки
    useEffect(() => {
      theoryStore.setLoading(isLoading);
    }, [isLoading, theoryStore]);

    // Обновляем ошибки
    useEffect(() => {
      if (error) {
        theoryStore.setError(error.message);
      }
    }, [error, theoryStore]);

    const handleCardFlip = useCallback(
      (cardId: string) => {
        const wasFlipped = theoryStore.isCardFlipped(cardId);
        theoryStore.toggleCardFlip(cardId);

        // Автоматически увеличиваем счетчик при переходе с вопроса на ответ
        if (!wasFlipped) {
          progressMutation.mutate({ cardId, action: "increment" });
        }

        onCardFlip?.(cardId);
      },
      [theoryStore, onCardFlip, progressMutation]
    );

    const handleProgressUpdate = useCallback(
      (cardId: string, action: "increment" | "decrement") => {
        progressMutation.mutate({ cardId, action });
      },
      [progressMutation]
    );

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Загрузка карточек...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Ошибка загрузки карточек</p>
          <Button onClick={() => refetch()} variant="outline">
            Попробовать снова
          </Button>
        </div>
      );
    }

    if (processedCards.length === 0 && !isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Карточки не найдены. Попробуйте изменить фильтры.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedCards.map((card: TheoryCard & { pageIndex: number }) => (
            <FlippableCard
              key={card.id}
              card={card}
              isFlipped={theoryStore.isCardFlipped(card.id)}
              onFlip={() => handleCardFlip(card.id)}
              onProgressUpdate={(action) =>
                handleProgressUpdate(card.id, action)
              }
            />
          ))}
        </div>

        {/* Индикатор загрузки следующей страницы */}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center items-center p-4 mt-4">
            {isFetchingNextPage ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <span>Загрузить еще...</span>
            )}
          </div>
        )}

        {/* Сообщение о завершении загрузки */}
        {!hasNextPage && processedCards.length > 0 && (
          <p className="text-center text-gray-500 mt-8 p-4">
            Все карточки загружены.
          </p>
        )}

        {/* Индикатор загрузки мутации */}
        {progressMutation.isPending && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Обновление прогресса...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
