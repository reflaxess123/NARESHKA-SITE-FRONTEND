import { z } from "zod";
import {
  TheoryCard,
  TheoryCardSchema,
  TheoryCardsApiResponse,
  TheoryCardsApiResponseSchema,
  TheoryCategoriesApiResponse,
  TheoryCategoriesApiResponseSchema,
  TheoryFiltersParams,
  UpdateTheoryProgressResponse,
  UpdateTheoryProgressResponseSchema,
} from "../model/types";

// Используем переменную окружения для базового URL API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "VITE_API_BASE_URL is not defined. Please check your .env file."
  );
}

// Функция для конструирования полного URL к API
const constructUrl = (path: string): string => {
  const basePath = API_BASE_URL || "";
  const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

// Обработчик ответов API
const handleApiResponse = async <T>(
  response: Response,
  zodSchema: z.ZodType<T>
): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      console.error("API Error Body:", errorBody);
      errorMessage += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
    } catch (_e) {
      const textResponse = await response.text();
      console.error("Non-JSON error response from server:", textResponse);
      errorMessage += ` - Server response: ${textResponse.substring(0, 200)}...`;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const json = await response.json();
    console.log("Raw Theory API Response:", json);
    const validatedData = zodSchema.parse(json);
    return validatedData;
  } catch (error: unknown) {
    console.error("Theory API response parsing or validation failed:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        `Ответ Theory API не соответствует ожидаемой схеме: ${error.errors
          .map((e) => `${e.path.join(".")} - ${e.message}`)
          .join(", ")}`
      );
    } else if (error instanceof SyntaxError) {
      console.error("Non-JSON response from theory server (SyntaxError):");
      throw new Error(`Сервер вернул невалидный JSON.`);
    } else if (error instanceof Error) {
      throw new Error(
        "Произошла ошибка при обработке ответа от theory сервера: " +
          (error.message || "Неизвестная ошибка")
      );
    } else {
      throw new Error(
        "Произошла неизвестная ошибка при обработке ответа от theory сервера."
      );
    }
  }
};

// Получение списка теоретических карточек
export const fetchTheoryCards = async (
  params: TheoryFiltersParams
): Promise<TheoryCardsApiResponse> => {
  const baseUrl = constructUrl("/api/theory/cards");
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  console.log(`Fetching theory cards from: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  return handleApiResponse(response, TheoryCardsApiResponseSchema);
};

// Получение конкретной теоретической карточки по ID
export const fetchTheoryCardById = async (id: string): Promise<TheoryCard> => {
  const url = constructUrl(`/api/theory/cards/${id}`);
  console.log(`Fetching theory card by ID from: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  return handleApiResponse(response, TheoryCardSchema);
};

// Получение категорий теоретических карточек
export const fetchTheoryCategories =
  async (): Promise<TheoryCategoriesApiResponse> => {
    const url = constructUrl("/api/theory/categories");
    console.log(`Fetching theory categories from: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      credentials: "include",
    });

    return handleApiResponse(response, TheoryCategoriesApiResponseSchema);
  };

// Обновление прогресса по теоретической карточке
export const updateTheoryCardProgress = async (
  cardId: string,
  action: "increment" | "decrement"
): Promise<UpdateTheoryProgressResponse> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const url = constructUrl(`/api/theory/cards/${cardId}/progress`);

  const response = await fetch(url, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: JSON.stringify({ action }),
  });

  return handleApiResponse(response, UpdateTheoryProgressResponseSchema);
};

// Ключи для TanStack Query
export const theoryKeys = {
  all: ["theory"] as const,
  cards: () => [...theoryKeys.all, "cards"] as const,
  card: (id: string) => [...theoryKeys.cards(), id] as const,
  categories: () => [...theoryKeys.all, "categories"] as const,
  filteredCards: (filters: TheoryFiltersParams) =>
    [...theoryKeys.cards(), "filtered", filters] as const,
};
