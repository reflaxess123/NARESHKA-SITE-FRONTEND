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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: filters.limit || 10 }).map((_, index) => (
          <ContentBlockCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 p-4">
        Ошибка при загрузке данных: {error?.message}
      </p>
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
    return <p className="p-4">По вашему запросу ничего не найдено.</p>;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedBlocks.map((item: ContentBlock & { pageIndex: number }) => (
          <ContentBlockCard
            key={item.id}
            block={item}
            onClick={onCardClick}
            currentFilters={filters}
          />
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref} className="flex justify-center items-center p-4 mt-4">
          {isFetchingNextPage ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <span>Загрузить еще...</span> // Можно сделать кнопкой или оставить так для авто-загрузки
          )}
        </div>
      )}
      {!hasNextPage && processedBlocks.length > 0 && (
        <p className="text-center text-gray-500 mt-8 p-4">
          Все элементы загружены.
        </p>
      )}
    </div>
  );
};
