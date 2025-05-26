import { z } from "zod";
import {
  CardStats,
  CardStatsSchema,
  DueCard,
  DueCardSchema,
  GeneralStats,
  GeneralStatsSchema,
  Intervals,
  IntervalsSchema,
  ReviewRequest,
  ReviewResponse,
  ReviewResponseSchema,
} from "../model/types";

// Используем ту же конфигурацию API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "VITE_API_BASE_URL is not defined. Please check your .env file."
  );
}

const constructUrl = (path: string): string => {
  const basePath = API_BASE_URL || "";
  const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

const handleApiResponse = async <T>(
  response: Response,
  zodSchema: z.ZodType<T>
): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      console.error("Spaced Repetition API Error Body:", errorBody);
      errorMessage += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
    } catch (_e) {
      const textResponse = await response.text();
      console.error(
        "Non-JSON error response from spaced repetition server:",
        textResponse
      );
      errorMessage += ` - Server response: ${textResponse.substring(0, 200)}...`;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const json = await response.json();
    console.log("Raw Spaced Repetition API Response:", json);
    const validatedData = zodSchema.parse(json);
    return validatedData;
  } catch (error: unknown) {
    console.error(
      "Spaced Repetition API response parsing or validation failed:",
      error
    );
    if (error instanceof z.ZodError) {
      throw new Error(
        `Ответ Spaced Repetition API не соответствует ожидаемой схеме: ${error.errors
          .map((e) => `${e.path.join(".")} - ${e.message}`)
          .join(", ")}`
      );
    } else if (error instanceof SyntaxError) {
      console.error(
        "Non-JSON response from spaced repetition server (SyntaxError):"
      );
      throw new Error(`Сервер вернул невалидный JSON.`);
    } else if (error instanceof Error) {
      throw new Error(
        "Произошла ошибка при обработке ответа от spaced repetition сервера: " +
          (error.message || "Неизвестная ошибка")
      );
    } else {
      throw new Error(
        "Произошла неизвестная ошибка при обработке ответа от spaced repetition сервера."
      );
    }
  }
};

// Повторение карточки
export const reviewCard = async (
  cardId: string,
  reviewData: ReviewRequest
): Promise<ReviewResponse> => {
  const url = constructUrl(`/api/theory/cards/${cardId}/review`);

  console.log(`Reviewing card: ${url.toString()}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(reviewData),
  });

  return handleApiResponse(response, ReviewResponseSchema);
};

// Получение карточек к повторению
export const fetchDueCards = async (
  params: {
    limit?: number;
    includeNew?: boolean;
    includeLearning?: boolean;
    includeReview?: boolean;
  } = {}
): Promise<DueCard[]> => {
  const url = constructUrl("/api/theory/cards/due");
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.includeNew !== undefined)
    searchParams.append("includeNew", params.includeNew.toString());
  if (params.includeLearning !== undefined)
    searchParams.append("includeLearning", params.includeLearning.toString());
  if (params.includeReview !== undefined)
    searchParams.append("includeReview", params.includeReview.toString());

  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  console.log(`Fetching due cards from: ${fullUrl.toString()}`);

  const response = await fetch(fullUrl, {
    credentials: "include",
  });

  return handleApiResponse(response, z.array(DueCardSchema));
};

// Получение статистики по карточке
export const fetchCardStats = async (cardId: string): Promise<CardStats> => {
  const url = constructUrl(`/api/theory/cards/${cardId}/stats`);

  console.log(`Fetching card stats from: ${url.toString()}`);

  const response = await fetch(url, {
    credentials: "include",
  });

  return handleApiResponse(response, CardStatsSchema);
};

// Получение вариантов интервалов
export const fetchCardIntervals = async (
  cardId: string
): Promise<Intervals> => {
  const url = constructUrl(`/api/theory/cards/${cardId}/intervals`);

  console.log(`Fetching card intervals from: ${url.toString()}`);

  const response = await fetch(url, {
    credentials: "include",
  });

  return handleApiResponse(response, IntervalsSchema);
};

// Сброс прогресса карточки
export const resetCardProgress = async (
  cardId: string
): Promise<{ message: string }> => {
  const url = constructUrl(`/api/theory/cards/${cardId}/reset`);

  console.log(`Resetting card progress: ${url.toString()}`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  return handleApiResponse(response, z.object({ message: z.string() }));
};

// Получение общей статистики
export const fetchGeneralStats = async (): Promise<GeneralStats> => {
  const url = constructUrl("/api/theory/stats");

  console.log(`Fetching general stats from: ${url.toString()}`);

  const response = await fetch(url, {
    credentials: "include",
  });

  return handleApiResponse(response, GeneralStatsSchema);
};

// Миграция существующих карточек в систему интервального повторения
export const migrateExistingCards = async (): Promise<{
  message: string;
  migratedCount: number;
}> => {
  const url = constructUrl("/api/theory/migrate");

  console.log(`Migrating existing cards: ${url.toString()}`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  return handleApiResponse(
    response,
    z.object({
      message: z.string(),
      migratedCount: z.number(),
    })
  );
};

// Ключи для TanStack Query
export const spacedRepetitionKeys = {
  all: ["spacedRepetition"] as const,
  dueCards: (params?: Record<string, unknown>) =>
    [...spacedRepetitionKeys.all, "dueCards", params] as const,
  cardStats: (cardId: string) =>
    [...spacedRepetitionKeys.all, "cardStats", cardId] as const,
  cardIntervals: (cardId: string) =>
    [...spacedRepetitionKeys.all, "cardIntervals", cardId] as const,
  generalStats: () => [...spacedRepetitionKeys.all, "generalStats"] as const,
  migration: () => [...spacedRepetitionKeys.all, "migration"] as const,
};
