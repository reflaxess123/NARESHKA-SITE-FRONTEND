import {
  ALL_THEORY_ITEMS_VALUE,
  fetchTheoryCategories,
  TheoryFiltersState,
  theoryKeys,
} from "@/entities/theory-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared";
import { Button } from "@/shared/ui/button";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw, Search } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

interface TheoryFiltersProps {
  initialFilters: TheoryFiltersState;
  onFiltersChange: (filters: Partial<TheoryFiltersState>) => void;
}

const SORT_OPTIONS = [
  { value: "orderIndex", label: "По порядку" },
  { value: "createdAt", label: "По дате создания" },
  { value: "updatedAt", label: "По дате обновления" },
  { value: "currentUserSolvedCount", label: "По количеству решений" },
];

const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "По возрастанию" },
  { value: "desc", label: "По убыванию" },
];

const LIMIT_OPTIONS = [
  { value: 6, label: "6 карточек" },
  { value: 12, label: "12 карточек" },
  { value: 24, label: "24 карточки" },
  { value: 48, label: "48 карточек" },
];

export const TheoryFilters: React.FC<TheoryFiltersProps> = ({
  initialFilters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Загрузка категорий
  const { data: categories = [] } = useQuery({
    queryKey: theoryKeys.categories(),
    queryFn: fetchTheoryCategories,
    staleTime: 10 * 60 * 1000, // 10 минут
  });

  // Получение подкатегорий для выбранной категории
  const subCategories = useMemo(() => {
    if (localFilters.category === ALL_THEORY_ITEMS_VALUE) {
      return [];
    }
    const selectedCategory = categories.find(
      (cat) => cat.name === localFilters.category
    );
    return selectedCategory?.subCategories || [];
  }, [categories, localFilters.category]);

  const handleFilterChange = useCallback(
    (key: keyof TheoryFiltersState, value: string | number | boolean) => {
      const newFilters = { ...localFilters, [key]: value };

      // Сброс подкатегории при изменении категории
      if (key === "category" && value !== localFilters.category) {
        newFilters.subCategory = ALL_THEORY_ITEMS_VALUE;
      }

      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFilterChange("searchText", e.target.value);
    },
    [handleFilterChange]
  );

  const handleReset = useCallback(() => {
    const resetFilters: TheoryFiltersState = {
      searchText: "",
      category: ALL_THEORY_ITEMS_VALUE,
      subCategory: ALL_THEORY_ITEMS_VALUE,
      sortBy: "orderIndex",
      sortOrder: "asc",
      limit: 12,
      onlyUnstudied: false,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      localFilters.searchText !== "" ||
      localFilters.category !== ALL_THEORY_ITEMS_VALUE ||
      localFilters.subCategory !== ALL_THEORY_ITEMS_VALUE ||
      localFilters.sortBy !== "orderIndex" ||
      localFilters.sortOrder !== "asc" ||
      localFilters.limit !== 12 ||
      localFilters.onlyUnstudied !== false
    );
  }, [localFilters]);

  return (
    <div className="space-y-4">
      {/* Основная строка поиска */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search">Поиск по карточкам</Label>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              type="text"
              placeholder="Введите текст для поиска..."
              value={localFilters.searchText}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Фильтры
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              !
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Расширенные фильтры */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          {/* Категория */}
          <div>
            <Label htmlFor="category">Категория</Label>
            <Select
              value={localFilters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_THEORY_ITEMS_VALUE}>
                  Все категории
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.totalCards})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Подкатегория */}
          <div>
            <Label htmlFor="subCategory">Подкатегория</Label>
            <Select
              value={localFilters.subCategory}
              onValueChange={(value) =>
                handleFilterChange("subCategory", value)
              }
              disabled={subCategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите подкатегорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_THEORY_ITEMS_VALUE}>
                  Все подкатегории
                </SelectItem>
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory.name} value={subCategory.name}>
                    {subCategory.name} ({subCategory.cardCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Сортировка */}
          <div>
            <Label htmlFor="sortBy">Сортировка</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сортировку" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Порядок сортировки */}
          <div>
            <Label htmlFor="sortOrder">Порядок</Label>
            <Select
              value={localFilters.sortOrder}
              onValueChange={(value) =>
                handleFilterChange("sortOrder", value as "asc" | "desc")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите порядок" />
              </SelectTrigger>
              <SelectContent>
                {SORT_ORDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Количество на странице */}
          <div className="md:col-span-2 lg:col-span-1">
            <Label htmlFor="limit">Карточек на странице</Label>
            <Select
              value={localFilters.limit.toString()}
              onValueChange={(value) =>
                handleFilterChange("limit", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите количество" />
              </SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Только неизученные */}
          <div className="md:col-span-2 lg:col-span-4 flex items-center space-x-2">
            <Input
              id="onlyUnstudied"
              type="checkbox"
              checked={localFilters.onlyUnstudied}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange("onlyUnstudied", e.target.checked)
              }
              className="w-4 h-4"
            />
            <Label
              htmlFor="onlyUnstudied"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Показывать только неизученные карточки (решено 0 раз)
            </Label>
          </div>
        </div>
      )}
    </div>
  );
};
