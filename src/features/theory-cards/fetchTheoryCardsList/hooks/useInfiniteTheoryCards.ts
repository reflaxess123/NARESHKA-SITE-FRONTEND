import {
  TheoryCardsApiResponse,
  TheoryFiltersParams,
} from "@/entities/theory-card";
import { fetchTheoryCards } from "@/shared";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteTheoryCardsParams
  extends Omit<TheoryFiltersParams, "page"> {
  enabled?: boolean;
}

const DEFAULT_LIMIT = 12;

export const useInfiniteTheoryCards = (
  params: UseInfiniteTheoryCardsParams
) => {
  const {
    q,
    category,
    subCategory,
    sortBy,
    sortOrder,
    limit = DEFAULT_LIMIT,
    onlyUnstudied,
    enabled = true,
  } = params;

  return useInfiniteQuery<
    TheoryCardsApiResponse, // TQueryFnData: тип данных, возвращаемых queryFn
    Error, // TError: тип ошибки
    TheoryCardsApiResponse, // TData: тип данных в результате (после select, если есть)
    // TQueryKey: тип ключа запроса
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    number // TPageParam: тип параметра страницы
  >({
    queryKey: [
      "theoryCards",
      { q, category, subCategory, sortBy, sortOrder, limit, onlyUnstudied },
    ],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams = {
        page: pageParam,
        limit,
        q,
        category,
        subCategory,
        sortBy,
        sortOrder,
        onlyUnstudied,
      };
      console.log(
        "useInfiniteTheoryCards: Запрос данных с параметрами:",
        queryParams,
        "queryKey:",
        [
          "theoryCards",
          { q, category, subCategory, sortBy, sortOrder, limit, onlyUnstudied },
        ]
      );
      return fetchTheoryCards(queryParams);
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
