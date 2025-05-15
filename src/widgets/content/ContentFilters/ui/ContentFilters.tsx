import { Category } from "@/entities/content-block";
import { useCategories } from "@/features/content";
import { Button } from "@/shared/ui";
import { X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  SimpleGrid,
  Paper,
  TextInput,
  Select,
  Group,
  Stack,
} from "@mantine/core";

export const ALL_ITEMS_VALUE = "__ALL_ITEMS__"; // Специальное значение для "всех элементов"

export interface ContentFiltersState {
  searchText: string;
  mainCategory: string; // Может содержать ALL_ITEMS_VALUE
  subCategory: string; // Может содержать ALL_ITEMS_VALUE
  sortBy: string;
  sortOrder: "asc" | "desc";
  limit: number;
}

interface ContentFiltersProps {
  initialFilters?: Partial<ContentFiltersState>;
  onFiltersChange: (filters: ContentFiltersState) => void;
}

const SORT_OPTIONS = [
  { value: "orderInFile", label: "Порядок в файле" },
  { value: "blockLevel", label: "Уровень блока" },
  { value: "createdAt", label: "Дата создания" },
  { value: "updatedAt", label: "Дата обновления" },
  { value: "file.webdavPath", label: "Путь к файлу" },
];

const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "По возрастанию" },
  { value: "desc", label: "По убыванию" },
];

const DEBOUNCE_DELAY = 500;

export const ContentFilters: React.FC<ContentFiltersProps> = ({
  initialFilters,
  onFiltersChange,
}) => {
  const [searchText, setSearchText] = useState(
    initialFilters?.searchText || ""
  );
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [mainCategory, setMainCategory] = useState(
    initialFilters?.mainCategory || ALL_ITEMS_VALUE
  );
  const [subCategory, setSubCategory] = useState(
    initialFilters?.subCategory || ALL_ITEMS_VALUE
  );
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || "orderInFile");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    initialFilters?.sortOrder || "asc"
  );

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    onFiltersChange({
      searchText: debouncedSearchText,
      mainCategory,
      subCategory,
      sortBy,
      sortOrder,
      limit: initialFilters?.limit || 10,
    });
  }, [
    debouncedSearchText,
    mainCategory,
    subCategory,
    sortBy,
    sortOrder,
    onFiltersChange,
    initialFilters?.limit,
  ]);

  useEffect(() => {
    if (mainCategory !== ALL_ITEMS_VALUE) {
      const currentMainCat = categoriesData?.find(
        (cat) => cat.name === mainCategory
      );
      if (
        currentMainCat &&
        !currentMainCat.subCategories.includes(subCategory) &&
        subCategory !== ALL_ITEMS_VALUE
      ) {
        setSubCategory(ALL_ITEMS_VALUE);
      }
    } else {
      setSubCategory(ALL_ITEMS_VALUE);
    }
  }, [mainCategory, subCategory, categoriesData]);

  const mainCategoryOptions = useMemo(
    () => [
      { value: ALL_ITEMS_VALUE, label: "Все основные" },
      ...(categoriesData?.map((cat: Category) => ({
        value: cat.name,
        label: cat.name,
      })) || []),
    ],
    [categoriesData]
  );

  const subCategoryOptions = useMemo(() => {
    if (mainCategory === ALL_ITEMS_VALUE || !categoriesData)
      return [{ value: ALL_ITEMS_VALUE, label: "Все подкатегории" }];
    const selectedMain = categoriesData.find(
      (cat: Category) => cat.name === mainCategory
    );
    return [
      { value: ALL_ITEMS_VALUE, label: "Все подкатегории" },
      ...(selectedMain
        ? selectedMain.subCategories.map((sub) => ({ value: sub, label: sub }))
        : []),
    ];
  }, [mainCategory, categoriesData]);

  const handleResetFilters = () => {
    setSearchText("");
    setMainCategory(ALL_ITEMS_VALUE);
    setSubCategory(ALL_ITEMS_VALUE);
    setSortBy("orderInFile");
    setSortOrder("asc");
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Stack gap="md">
        <TextInput
          placeholder="Поиск..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <Select
            label="Основная категория"
            placeholder="Выберите категорию"
            data={mainCategoryOptions}
            value={mainCategory}
            onChange={(value) => setMainCategory(value || ALL_ITEMS_VALUE)}
            disabled={isLoadingCategories}
            clearable
          />
          <Select
            label="Подкатегория"
            placeholder="Выберите подкатегорию"
            data={subCategoryOptions}
            value={subCategory}
            onChange={(value) => setSubCategory(value || ALL_ITEMS_VALUE)}
            disabled={
              mainCategory === ALL_ITEMS_VALUE || subCategoryOptions.length <= 1
            }
            clearable
          />
          <Select
            label="Сортировать по"
            placeholder="Выберите поле сортировки"
            data={SORT_OPTIONS}
            value={sortBy}
            onChange={(value) => setSortBy(value || "orderInFile")}
            clearable
          />
          <Select
            label="Направление"
            placeholder="Выберите направление"
            data={SORT_ORDER_OPTIONS}
            value={sortOrder}
            onChange={(value) =>
              setSortOrder((value as "asc" | "desc") || "asc")
            }
            clearable
          />
        </SimpleGrid>
        <Group justify="flex-start">
          <Button
            onClick={handleResetFilters}
            variant="light"
            size="sm"
            leftSection={<X size={16} />}
          >
            Сбросить все фильтры
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
