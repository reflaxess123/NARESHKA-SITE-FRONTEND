import { Category } from "@/entities/content-block";
import { useCategories } from "@/features/content";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

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

  const subCategoryOptions = useMemo(() => {
    if (mainCategory === ALL_ITEMS_VALUE || !categoriesData) return [];
    const selectedMain = categoriesData.find(
      (cat: Category) => cat.name === mainCategory
    );
    return selectedMain
      ? selectedMain.subCategories.map((sub) => ({ value: sub, label: sub }))
      : [];
  }, [mainCategory, categoriesData]);

  const handleResetFilters = () => {
    setSearchText("");
    setMainCategory(ALL_ITEMS_VALUE);
    setSubCategory(ALL_ITEMS_VALUE);
    setSortBy("orderInFile");
    setSortOrder("asc");
  };

  return (
    <div className="p-4 space-y-4 border rounded-md bg-white dark:bg-neutral-800">
      <Input
        placeholder="Поиск..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-sm"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <Select
          value={mainCategory}
          onValueChange={setMainCategory}
          disabled={isLoadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder="Основная категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ITEMS_VALUE}>Все основные</SelectItem>
            {categoriesData?.map((cat: Category) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={subCategory}
          onValueChange={setSubCategory}
          disabled={
            mainCategory === ALL_ITEMS_VALUE || subCategoryOptions.length === 0
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Подкатегория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ITEMS_VALUE}>Все подкатегории</SelectItem>
            {subCategoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Сортировать по" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Направление" />
          </SelectTrigger>
          <SelectContent>
            {SORT_ORDER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleResetFilters} variant="outline" size="sm">
        <X className="mr-2 h-4 w-4" /> Сбросить все фильтры
      </Button>
    </div>
  );
};
