// Экспорты типов
export type {
  CardState,
  CardStats,
  DueCard,
  ExtendedUserTheoryProgress,
  GeneralStats,
  Intervals,
  Rating,
  ReviewRequest,
  ReviewResponse,
  TheoryCard,
  TheoryCardsApiResponse,
  TheoryCategoriesApiResponse,
  TheoryCategory,
  TheoryFiltersParams,
  TheoryFiltersState,
  TheoryPaginationInfo,
  UpdateTheoryProgressResponse,
  UserTheoryProgress,
} from "./model/types";

// Экспорты схем Zod
export {
  ALL_THEORY_ITEMS_VALUE,
  CardStateSchema,
  CardStatsSchema,
  DEFAULT_THEORY_FILTERS,
  DueCardSchema,
  ExtendedUserTheoryProgressSchema,
  GeneralStatsSchema,
  IntervalsSchema,
  RatingSchema,
  ReviewRequestSchema,
  ReviewResponseSchema,
  TheoryCardsApiResponseSchema,
  TheoryCardSchema,
  TheoryCategoriesApiResponseSchema,
  TheoryCategorySchema,
  TheoryPaginationInfoSchema,
  UpdateTheoryProgressResponseSchema,
  UserTheoryProgressSchema,
} from "./model/types";

// Экспорт store
export { TheoryStore } from "./model/TheoryStore";

// Экспорты API
export {
  fetchTheoryCardById,
  fetchTheoryCards,
  fetchTheoryCategories,
  theoryKeys,
  updateTheoryCardProgress,
} from "./api/theoryApi";

// Новые API методы для интервального повторения
export {
  fetchCardIntervals,
  fetchCardStats,
  fetchDueCards,
  fetchGeneralStats,
  migrateExistingCards,
  resetCardProgress,
  reviewCard,
  spacedRepetitionKeys,
} from "./api/spacedRepetitionApi";

// Экспорт хука (будет исправлен после обновления RootStore)
export { useTheoryStore } from "./hooks/useTheoryStore";
