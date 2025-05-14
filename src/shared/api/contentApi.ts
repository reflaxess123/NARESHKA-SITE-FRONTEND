import {
  CategoriesApiResponse,
  CategoriesApiResponseSchema,
  ContentBlock,
  ContentBlockSchema,
  ContentBlocksApiResponse,
  ContentBlocksApiResponseSchema,
  UpdateProgressResponse,
  UpdateProgressResponseSchema,
} from "@/entities/content-block";
import { z } from "zod";

// Используем переменную окружения для базового URL API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "VITE_API_BASE_URL is not defined. Please check your .env file."
  );
}

// Функция для конструирования полного URL к API
const constructUrl = (path: string): string => {
  // path должен начинаться со слеша, например, "/api/content/blocks"
  const basePath = API_BASE_URL || ""; // Используем пустую строку, если не определено, для относительных путей

  // Убираем возможный слеш в конце basePath и добавляем слеш в начале path, если его нет
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
    console.log("Raw API Response:", json);
    const validatedData = zodSchema.parse(json);
    return validatedData;
  } catch (error: unknown) {
    // Используем unknown и проверяем тип
    console.error("API response parsing or validation failed:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        `Ответ API не соответствует ожидаемой схеме: ${error.errors
          .map((e) => `${e.path.join(".")} - ${e.message}`)
          .join(", ")}`
      );
    } else if (error instanceof SyntaxError) {
      console.error("Non-JSON response from server (SyntaxError):");
      throw new Error(`Сервер вернул невалидный JSON.`);
    } else if (error instanceof Error) {
      // Проверка на Error для доступа к message
      throw new Error(
        "Произошла ошибка при обработке ответа от сервера: " +
          (error.message || "Неизвестная ошибка")
      );
    } else {
      throw new Error(
        "Произошла неизвестная ошибка при обработке ответа от сервера."
      );
    }
  }
};

export const fetchContentBlocks = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  mainCategory?: string;
  subCategory?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filePathId?: string;
}): Promise<ContentBlocksApiResponse> => {
  // Используем constructUrl для формирования базового пути
  const baseUrl = constructUrl("/api/content/blocks");
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  console.log(`Fetching content blocks from: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    credentials: "include",
  });
  return handleApiResponse(response, ContentBlocksApiResponseSchema);
};

export const fetchContentBlockById = async (
  id: string
): Promise<ContentBlock> => {
  const url = constructUrl(`/api/content/blocks/${id}`);
  console.log(`Fetching content block by ID from: ${url.toString()}`);
  const response = await fetch(url.toString(), {
    credentials: "include",
  });
  return handleApiResponse(response, ContentBlockSchema);
};

export const fetchCategories = async (): Promise<CategoriesApiResponse> => {
  const url = constructUrl("/api/content/categories");
  console.log(`Fetching categories from: ${url.toString()}`);
  const response = await fetch(url.toString(), {
    credentials: "include",
  });
  return handleApiResponse(response, CategoriesApiResponseSchema);
};

export const updateContentBlockProgress = async (
  blockId: string,
  action: "increment" | "decrement"
): Promise<UpdateProgressResponse> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const url = constructUrl(`/api/content/blocks/${blockId}/progress`);

  const response = await fetch(url, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: JSON.stringify({ action }),
  });

  return handleApiResponse(response, UpdateProgressResponseSchema);
};
