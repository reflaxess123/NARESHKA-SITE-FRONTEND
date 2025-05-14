import { z } from "zod";

export const ContentFileSchema = z.object({
  id: z.string(),
  webdavPath: z.string(),
  mainCategory: z.string(),
  subCategory: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ContentFile = z.infer<typeof ContentFileSchema>;

export const ContentBlockSchema = z.object({
  id: z.string(),
  fileId: z.string(),
  pathTitles: z.array(z.string()),
  blockTitle: z.string(),
  blockLevel: z.number(),
  textContent: z.string().nullable(),
  orderInFile: z.number(),
  codeContent: z.string().nullable(),
  codeLanguage: z.string().nullable(),
  isCodeFoldable: z.boolean(),
  codeFoldTitle: z.string().nullable(),
  extractedUrls: z.array(z.string()),
  currentUserSolvedCount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  file: ContentFileSchema,
});

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const PaginationInfoSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export type PaginationInfo = z.infer<typeof PaginationInfoSchema>;

export const ContentBlocksApiResponseSchema = z.object({
  data: z.array(ContentBlockSchema),
  pagination: PaginationInfoSchema,
});

export type ContentBlocksApiResponse = z.infer<
  typeof ContentBlocksApiResponseSchema
>;

export const CategorySchema = z.object({
  name: z.string(),
  subCategories: z.array(z.string()),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesApiResponseSchema = z.array(CategorySchema);

export type CategoriesApiResponse = z.infer<typeof CategoriesApiResponseSchema>;

// Схема и тип для ответа от API обновления прогресса
export const UpdateProgressResponseSchema = z.object({
  userId: z.union([z.number(), z.string()]), // Предполагаем, что userId может быть числом или строкой
  blockId: z.string(),
  solvedCount: z.number(),
});

export type UpdateProgressResponse = z.infer<
  typeof UpdateProgressResponseSchema
>;

// Определение для фильтров контентных блоков
export interface ContentBlockFilters {
  q?: string;
  mainCategory?: string;
  subCategory?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  // filePathId?: string; // Если используется, добавьте
}
