import { PageWrapper } from "@/shared/ui/PageWrapper";
import {
  ALL_ITEMS_VALUE,
  ContentBlockList,
  ContentBlockModal,
  ContentFilters,
  ContentFiltersState,
} from "@/widgets/content";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULT_PAGE_LIMIT = 10; // Определим константу для лимита

// const initialFilterState: ContentFiltersState = { // Удалено, так как больше не используется напрямую
//   searchText: "",
//   mainCategory: ALL_ITEMS_VALUE,
//   subCategory: ALL_ITEMS_VALUE,
//   sortBy: "orderInFile", // Default sort option
//   sortOrder: "asc", // Default sort order
// };

// Helper function to get filters from search params
const getFiltersFromSearchParams = (
  searchParams: URLSearchParams
): ContentFiltersState => {
  return {
    searchText: searchParams.get("q") || "",
    mainCategory: searchParams.get("mainCategory") || ALL_ITEMS_VALUE,
    subCategory: searchParams.get("subCategory") || ALL_ITEMS_VALUE,
    sortBy: searchParams.get("sortBy") || "orderInFile",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : DEFAULT_PAGE_LIMIT,
  };
};

export const NareshkaPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ContentFiltersState>(() =>
    getFiltersFromSearchParams(searchParams)
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    () => searchParams.get("modalBlockId") // Инициализация selectedBlockId из URL
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    () => !!searchParams.get("modalBlockId") // Инициализация isModalOpen из URL
  );

  // Effect to synchronize selectedBlockId and isModalOpen with URL (modalBlockId)
  useEffect(() => {
    const currentModalBlockId = searchParams.get("modalBlockId");
    if (selectedBlockId && isModalOpen) {
      if (currentModalBlockId !== selectedBlockId) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("modalBlockId", selectedBlockId);
        setSearchParams(newSearchParams, { replace: true });
      }
    } else if (!selectedBlockId && !isModalOpen) {
      if (currentModalBlockId) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("modalBlockId");
        setSearchParams(newSearchParams, { replace: true });
      }
    }
  }, [selectedBlockId, isModalOpen, searchParams, setSearchParams]);

  // Effect to initialize modal state from URL on first load or direct navigation
  useEffect(() => {
    const modalIdFromUrl = searchParams.get("modalBlockId");
    if (modalIdFromUrl && !selectedBlockId && !isModalOpen) {
      setSelectedBlockId(modalIdFromUrl);
      setIsModalOpen(true);
    }
    // Этот эффект должен запускаться только один раз или когда searchParams меняются извне,
    // но не должен конфликтовать с предыдущим эффектом.
    // Мы не добавляем selectedBlockId и isModalOpen в зависимости, чтобы избежать циклов.
  }, [searchParams]); // Удалены selectedBlockId и isModalOpen из зависимостей

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
  }, [searchParams]); // Filters удалены из зависимостей, getFiltersFromSearchParams стабильна

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams(); // Начинаем с чистого листа для параметров фильтров

    if (filters.searchText) newSearchParams.set("q", filters.searchText);
    if (filters.mainCategory && filters.mainCategory !== ALL_ITEMS_VALUE)
      newSearchParams.set("mainCategory", filters.mainCategory);
    if (filters.subCategory && filters.subCategory !== ALL_ITEMS_VALUE)
      newSearchParams.set("subCategory", filters.subCategory);
    if (filters.sortBy && filters.sortBy !== "orderInFile")
      newSearchParams.set("sortBy", filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== "asc")
      newSearchParams.set("sortOrder", filters.sortOrder);
    if (filters.limit && filters.limit !== DEFAULT_PAGE_LIMIT)
      newSearchParams.set("limit", String(filters.limit));

    // Сохраняем modalBlockId, если он есть
    const currentModalBlockId = searchParams.get("modalBlockId");
    if (currentModalBlockId) {
      newSearchParams.set("modalBlockId", currentModalBlockId);
    }

    // Применяем изменения только если они действительно есть
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]); // Добавлен searchParams в зависимости

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ContentFiltersState>) => {
      // При обновлении фильтров, убедимся, что limit сохраняется или устанавливается в дефолтное значение
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        limit: newFilters.limit || prev.limit || DEFAULT_PAGE_LIMIT,
      }));
    },
    []
  );

  const apiFilters = useMemo(() => {
    return {
      q: filters.searchText || undefined,
      mainCategory:
        filters.mainCategory === ALL_ITEMS_VALUE
          ? undefined
          : filters.mainCategory,
      subCategory:
        filters.subCategory === ALL_ITEMS_VALUE
          ? undefined
          : filters.subCategory,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: filters.limit || DEFAULT_PAGE_LIMIT,
    };
  }, [filters]);

  const handleCardClick = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBlockId(null);
  }, []);

  return (
    <PageWrapper>
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Нарешка
        </h1>

        <div className="mb-8 bg-card rounded-xl p-6 shadow-sm">
          <ContentFilters
            initialFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <ContentBlockList filters={apiFilters} onCardClick={handleCardClick} />

        <ContentBlockModal
          blockId={selectedBlockId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </PageWrapper>
  );
};
