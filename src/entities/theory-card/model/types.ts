import { z } from "zod";

// Схема для теоретической карточки
export const TheoryCardSchema = z.object({
  id: z.string(),
  ankiGuid: z.string(),
  cardType: z.string(),
  deck: z.string(),
  category: z.string(),
  subCategory: z.string().nullable().optional(),
  questionBlock: z.string(),
  answerBlock: z.string(),
  tags: z.array(z.string()),
  orderIndex: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  currentUserSolvedCount: z.number(),
});

export type TheoryCard = z.infer<typeof TheoryCardSchema>;

// Схема для прогресса пользователя
export const UserTheoryProgressSchema = z.object({
  id: z.string(),
  userId: z.number(),
  cardId: z.string(),
  solvedCount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserTheoryProgress = z.infer<typeof UserTheoryProgressSchema>;

// Схема для категории
export const TheoryCategorySchema = z.object({
  name: z.string(),
  subCategories: z.array(
    z.object({
      name: z.string(),
      cardCount: z.number(),
    })
  ),
  totalCards: z.number(),
});

export type TheoryCategory = z.infer<typeof TheoryCategorySchema>;

// Схема для пагинации
export const TheoryPaginationInfoSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export type TheoryPaginationInfo = z.infer<typeof TheoryPaginationInfoSchema>;

// Схема для ответа API со списком карточек
export const TheoryCardsApiResponseSchema = z.object({
  data: z.array(TheoryCardSchema),
  pagination: TheoryPaginationInfoSchema,
});

export type TheoryCardsApiResponse = z.infer<
  typeof TheoryCardsApiResponseSchema
>;

// Схема для ответа API со списком категорий
export const TheoryCategoriesApiResponseSchema = z.array(TheoryCategorySchema);

export type TheoryCategoriesApiResponse = z.infer<
  typeof TheoryCategoriesApiResponseSchema
>;

// Схема для ответа обновления прогресса
export const UpdateTheoryProgressResponseSchema = z.object({
  userId: z.number(),
  cardId: z.string(),
  solvedCount: z.number(),
});

export type UpdateTheoryProgressResponse = z.infer<
  typeof UpdateTheoryProgressResponseSchema
>;

// Интерфейс для состояния фильтров
export interface TheoryFiltersState {
  searchText: string;
  category: string;
  subCategory: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  limit: number;
  onlyUnstudied: boolean;
}

// Интерфейс для параметров API фильтров
export interface TheoryFiltersParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  deck?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
  onlyUnstudied?: boolean;
}

// Константы
export const ALL_THEORY_ITEMS_VALUE = "all";

export const DEFAULT_THEORY_FILTERS: TheoryFiltersState = {
  searchText: "",
  category: ALL_THEORY_ITEMS_VALUE,
  subCategory: ALL_THEORY_ITEMS_VALUE,
  sortBy: "orderIndex",
  sortOrder: "asc",
  limit: 10,
  onlyUnstudied: false,
};

// Состояния карточек для интервального повторения
export const CardStateSchema = z.enum([
  "NEW",
  "LEARNING",
  "REVIEW",
  "RELEARNING",
]);
export type CardState = z.infer<typeof CardStateSchema>;

// Оценки сложности
export const RatingSchema = z.enum(["again", "hard", "good", "easy"]);
export type Rating = z.infer<typeof RatingSchema>;

// Расширенная схема прогресса пользователя с полями интервального повторения
export const ExtendedUserTheoryProgressSchema = z.object({
  id: z.string(),
  userId: z.number(),
  cardId: z.string(),
  solvedCount: z.number(), // старое поле для обратной совместимости
  // Новые поля для интервального повторения
  easeFactor: z.number().min(1.3).max(2.5),
  interval: z.number().min(0),
  cardState: CardStateSchema,
  reviewCount: z.number().min(0),
  lapseCount: z.number().min(0),
  learningStep: z.number().min(0),
  dueDate: z.string().datetime().nullable(),
  lastReviewDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Схема для запроса повторения карточки
export const ReviewRequestSchema = z.object({
  rating: RatingSchema,
  responseTime: z.number().optional(),
});

// Схема для ответа повторения карточки
export const ReviewResponseSchema = z.object({
  userId: z.number(),
  cardId: z.string(),
  newInterval: z.number(),
  newDueDate: z.string().datetime().nullable(),
  easeFactor: z.number(),
  cardState: CardStateSchema,
  reviewCount: z.number(),
  lapseCount: z.number(),
  nextReviewIntervals: z.object({
    again: z.number(),
    hard: z.number(),
    good: z.number(),
    easy: z.number(),
  }),
});

// Схема для карточки к повторению
export const DueCardSchema = TheoryCardSchema.omit({
  currentUserSolvedCount: true,
}).extend({
  dueDate: z.string().datetime().nullable(),
  cardState: CardStateSchema,
  interval: z.number(),
  easeFactor: z.number(),
  reviewCount: z.number(),
  lapseCount: z.number(),
  isOverdue: z.boolean(),
  daysSinceLastReview: z.number().nullable(),
  priority: z.number(),
  // Делаем currentUserSolvedCount опциональным для интервального повторения
  currentUserSolvedCount: z.number().optional(),
});

// Схема для статистики карточки
export const CardStatsSchema = z.object({
  cardId: z.string(),
  userId: z.number(),
  totalReviews: z.number(),
  lapseCount: z.number(),
  easeFactor: z.number(),
  currentInterval: z.number(),
  cardState: CardStateSchema,
  dueDate: z.string().datetime().nullable(),
  lastReviewDate: z.string().datetime().nullable(),
  averageResponseTime: z.number().nullable(),
  retentionRate: z.number(),
  nextReviewIntervals: z.object({
    again: z.number(),
    hard: z.number(),
    good: z.number(),
    easy: z.number(),
  }),
});

// Схема для общей статистики
export const GeneralStatsSchema = z.object({
  new: z.number(),
  learning: z.number(),
  review: z.number(),
  total: z.number(),
});

// Схема для интервалов
export const IntervalsSchema = z.object({
  again: z.number(),
  hard: z.number(),
  good: z.number(),
  easy: z.number(),
});

// Экспорт типов
export type ExtendedUserTheoryProgress = z.infer<
  typeof ExtendedUserTheoryProgressSchema
>;
export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type DueCard = z.infer<typeof DueCardSchema>;
export type CardStats = z.infer<typeof CardStatsSchema>;
export type GeneralStats = z.infer<typeof GeneralStatsSchema>;
export type Intervals = z.infer<typeof IntervalsSchema>;
