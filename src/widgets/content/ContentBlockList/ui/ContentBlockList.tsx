import {
  ContentBlock,
  ContentBlockCard,
  ContentBlockCardSkeleton,
  ContentBlocksApiResponse,
} from "@/entities/content-block";
import { ContentBlockFilters } from "@/entities/content-block/model/types";
import { useInfiniteContentBlocks } from "@/features/content";
import { InfiniteData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SimpleGrid, Text, Alert } from "@mantine/core";

interface ContentBlockListProps {
  filters: ContentBlockFilters;
  onCardClick: (blockId: string) => void;
}

export const ContentBlockList: React.FC<ContentBlockListProps> = ({
  filters,
  onCardClick,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteContentBlocks({ ...filters, limit: filters.limit || 10 });

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    // Render skeleton for the initial load of the list itself
    return (
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing="md"
      >
        {Array.from({ length: filters.limit || 10 }).map((_, index) => (
          <ContentBlockCardSkeleton key={index} />
        ))}
      </SimpleGrid>
    );
  }

  if (isError) {
    return (
      <Alert title="Ошибка" color="red" variant="light">
        Ошибка при загрузке данных: {error?.message}
      </Alert>
    );
  }

  const typedData = data as InfiniteData<ContentBlocksApiResponse> | undefined;
  // Сначала получаем все блоки со всех страниц, возможно с дубликатами
  const allBlocksFromPagesIncludingDuplicates: (ContentBlock & {
    pageIndex: number;
  })[] =
    typedData?.pages.flatMap((page: ContentBlocksApiResponse, index: number) =>
      page.data.map((block) => ({ ...block, pageIndex: index }))
    ) || [];

  // Удаляем дубликаты по id, сохраняя первый встреченный элемент
  const processedBlocks = Array.from(
    new Map(
      allBlocksFromPagesIncludingDuplicates.map((item) => [item.id, item])
    ).values()
  );

  if (processedBlocks.length === 0) {
    return <Text p="md">По вашему запросу ничего не найдено.</Text>;
  }

  return (
    <div>
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing="md"
        mb="md"
      >
        {processedBlocks.map((item: ContentBlock & { pageIndex: number }) => (
          <ContentBlockCard
            key={item.id}
            block={item}
            onClick={onCardClick}
            currentFilters={filters}
          />
        ))}
      </SimpleGrid>
      {hasNextPage && (
        <div ref={ref} className="flex justify-center items-center p-4 mt-4">
          {isFetchingNextPage ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <span>Загрузить еще...</span>
          )}
        </div>
      )}
      {!hasNextPage && processedBlocks.length > 0 && (
        <Text ta="center" c="dimmed" mt="xl" p="md">
          Все элементы загружены.
        </Text>
      )}
    </div>
  );
};
