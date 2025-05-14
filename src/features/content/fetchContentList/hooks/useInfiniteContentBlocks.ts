import { ContentBlocksApiResponse } from "@/entities/content-block";
import { fetchContentBlocks } from "@/shared"; // Corrected import path
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteContentBlocksParams {
  q?: string;
  mainCategory?: string;
  subCategory?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  enabled?: boolean;
}

const DEFAULT_LIMIT = 10;

export const useInfiniteContentBlocks = (
  params: UseInfiniteContentBlocksParams
) => {
  const {
    q,
    mainCategory,
    subCategory,
    sortBy,
    sortOrder,
    limit = DEFAULT_LIMIT,
    enabled = true,
  } = params;

  return useInfiniteQuery<
    ContentBlocksApiResponse, // TQueryFnData: тип данных, возвращаемых queryFn
    Error, // TError: тип ошибки
    ContentBlocksApiResponse, // TData: тип данных в результате (после select, если есть)
    // TQueryKey: тип ключа запроса
    // Если TQueryKey более сложный, его можно определить отдельно
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    number // TPageParam: тип параметра страницы
  >({
    queryKey: [
      "contentBlocks",
      { q, mainCategory, subCategory, sortBy, sortOrder, limit },
    ],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams = {
        page: pageParam,
        limit,
        q,
        mainCategory,
        subCategory,
        sortBy,
        sortOrder,
      };
      console.log(
        "useInfiniteContentBlocks: Запрос данных с параметрами:",
        queryParams,
        "queryKey:",
        [
          "contentBlocks",
          { q, mainCategory, subCategory, sortBy, sortOrder, limit },
        ]
      );
      return fetchContentBlocks(queryParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    enabled: enabled,
  });
};
