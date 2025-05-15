import { Button, PageWrapper } from "@/shared/ui";
import {
  ALL_ITEMS_VALUE,
  ContentBlockList,
  ContentBlockModal,
  ContentFilters,
  ContentFiltersState,
} from "@/widgets/content";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Title, Group, Box, Container } from "@mantine/core";
import { ArrowLeft } from "lucide-react";

const DEFAULT_PAGE_LIMIT = 10; // Определим константу для лимита

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
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(() =>
    searchParams.get("modalBlockId")
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    () => !!searchParams.get("modalBlockId")
  );
  const navigate = useNavigate();
  const prevModalIdFromUrl = useRef<string | null>(null); // Ref to store previous modalIdFromUrl

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

    // Only proceed if modalIdFromUrl has actually changed (or on initial render when prev is null)
    // and the modal is not already open with the same ID.
    if (modalIdFromUrl && modalIdFromUrl !== prevModalIdFromUrl.current) {
      if (!selectedBlockId && !isModalOpen) {
        // Original condition: only if modal is fully closed
        setSelectedBlockId(modalIdFromUrl);
        setIsModalOpen(true);
      }
    }
    // Update the ref for the next render AFTER all logic.
    prevModalIdFromUrl.current = modalIdFromUrl;
  }, [
    searchParams,
    selectedBlockId,
    isModalOpen,
    setSelectedBlockId,
    setIsModalOpen,
  ]); // All dependencies included

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
      <Container size="lg">
        <Group align="center" mb="xl">
          <Button variant="outline" onClick={() => navigate(-1)} mr="md">
            <ArrowLeft />
          </Button>
          <Title order={1} style={{ textAlign: "center", flexGrow: 1 }}>
            Нарешка
          </Title>
        </Group>

        <Box mb="xl">
          <ContentFilters
            initialFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </Box>

        <ContentBlockList filters={apiFilters} onCardClick={handleCardClick} />

        <ContentBlockModal
          blockId={selectedBlockId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </Container>
    </PageWrapper>
  );
};
