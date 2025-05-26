import {
  ALL_THEORY_ITEMS_VALUE,
  fetchGeneralStats,
  spacedRepetitionKeys,
  TheoryFiltersParams,
  TheoryFiltersState,
  useTheoryStore,
} from "@/entities/theory-card";
import { PageWrapper } from "@/shared";
import {
  TheoryCardsList,
  TheoryFilters,
  TheoryProgress,
} from "@/widgets/theory-cards";
import { StudyModeToggle } from "@/widgets/theory-cards/StudyModeToggle";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DEFAULT_PAGE_LIMIT = 12;

// Helper function to get filters from search params
const getFiltersFromSearchParams = (
  searchParams: URLSearchParams
): TheoryFiltersState => {
  return {
    searchText: searchParams.get("q") || "",
    category: searchParams.get("category") || ALL_THEORY_ITEMS_VALUE,
    subCategory: searchParams.get("subCategory") || ALL_THEORY_ITEMS_VALUE,
    sortBy: searchParams.get("sortBy") || "orderIndex",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : DEFAULT_PAGE_LIMIT,
    onlyUnstudied: searchParams.get("onlyUnstudied") === "true",
  };
};

export const TheoryPage: React.FC = observer(() => {
  const theoryStore = useTheoryStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<TheoryFiltersState>(() =>
    getFiltersFromSearchParams(searchParams)
  );

  // Запрос общей статистики интервального повторения
  const { data: generalStats, error: statsError } = useQuery({
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

  // Логируем ошибки статистики (не критично для основной функциональности)
  useEffect(() => {
    if (statsError) {
      console.error(
        "Ошибка загрузки статистики интервального повторения:",
        statsError
      );
    }
  }, [statsError]);

  // Effect to update filters state when searchParams change (e.g., browser back/forward)
  useEffect(() => {
    const filtersFromUrl = getFiltersFromSearchParams(searchParams);
    setFilters((prevFilters) => {
      // Сравниваем с предыдущим состоянием, чтобы избежать ненужных обновлений и циклов
      if (JSON.stringify(filtersFromUrl) !== JSON.stringify(prevFilters)) {
        return filtersFromUrl;
      }
      return prevFilters;
    });
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (filters.searchText) newSearchParams.set("q", filters.searchText);
    if (filters.category && filters.category !== ALL_THEORY_ITEMS_VALUE)
      newSearchParams.set("category", filters.category);
    if (filters.subCategory && filters.subCategory !== ALL_THEORY_ITEMS_VALUE)
      newSearchParams.set("subCategory", filters.subCategory);
    if (filters.sortBy && filters.sortBy !== "orderIndex")
      newSearchParams.set("sortBy", filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== "asc")
      newSearchParams.set("sortOrder", filters.sortOrder);
    if (filters.limit && filters.limit !== DEFAULT_PAGE_LIMIT)
      newSearchParams.set("limit", String(filters.limit));
    if (filters.onlyUnstudied) newSearchParams.set("onlyUnstudied", "true");

    // Применяем изменения только если они действительно есть
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<TheoryFiltersState>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        limit: newFilters.limit || prev.limit || DEFAULT_PAGE_LIMIT,
      }));
    },
    []
  );

  const apiFilters: TheoryFiltersParams = useMemo(() => {
    return {
      q: filters.searchText || undefined,
      category:
        filters.category === ALL_THEORY_ITEMS_VALUE
          ? undefined
          : filters.category,
      subCategory:
        filters.subCategory === ALL_THEORY_ITEMS_VALUE
          ? undefined
          : filters.subCategory,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: filters.limit || DEFAULT_PAGE_LIMIT,
      onlyUnstudied: filters.onlyUnstudied || undefined,
    };
  }, [filters]);

  const handleCardFlip = useCallback((cardId: string) => {
    console.log(`Card flipped: ${cardId}`);
  }, []);

  const handleModeChange = useCallback(
    (mode: "classic" | "spaced") => {
      theoryStore.setStudyMode(mode);
      if (mode === "spaced") {
        navigate("/theory/review");
      }
    },
    [theoryStore, navigate]
  );

  return (
    <PageWrapper>
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Теоретические карточки
        </h1>

        {/* Переключатель режимов */}
        <StudyModeToggle
          currentMode={theoryStore.studyMode}
          onModeChange={handleModeChange}
          stats={{
            classic: {
              totalCards: theoryStore.totalItems,
              solvedCards: theoryStore.solvedCardsCount,
            },
            spaced: {
              dueCards: theoryStore.dueCardsCount,
              newCards: theoryStore.newCardsCount,
              learningCards: theoryStore.learningCardsCount,
              reviewCards: theoryStore.reviewCardsCount,
            },
          }}
        />

        {/* Прогресс пользователя */}
        <div className="mb-8">
          <TheoryProgress />
        </div>

        {/* Фильтры */}
        <div className="mb-8 bg-card rounded-xl p-6 shadow-sm">
          <TheoryFilters
            initialFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Список карточек */}
        <TheoryCardsList filters={apiFilters} onCardFlip={handleCardFlip} />
      </div>
    </PageWrapper>
  );
});
