import { useUpdateContentProgress } from "@/features/content";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Check, Minus, Plus } from "lucide-react";
import React from "react";
import { DiJavascript1, DiReact } from "react-icons/di";
import { SiTypescript } from "react-icons/si";
import { type ContentBlock, type ContentBlockFilters } from "../../model/types";

interface ContentBlockCardProps {
  block: ContentBlock;
  onClick?: (blockId: string) => void;
  currentFilters: ContentBlockFilters;
}

// Маппинг категорий на иконки
const categoryIcons: Record<string, React.ElementType> = {
  JS: DiJavascript1,
  TS: SiTypescript,
  REACT: DiReact,
  // ZOD: FaCheckCircle, // Пример для Zod, если найдем иконку
};

export const ContentBlockCard: React.FC<ContentBlockCardProps> = ({
  block,
  onClick,
  currentFilters, // Получаем фильтры
}) => {
  const { mutate: updateProgress, isPending: isUpdatingProgress } =
    useUpdateContentProgress(currentFilters); // Передаем фильтры в хук

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Не открывать модалку при клике на кнопки прогресса
    if ((e.target as HTMLElement).closest(".progress-button")) {
      return;
    }
    if (onClick) {
      onClick(block.id);
    }
  };

  const handleProgressChange = (action: "increment" | "decrement") => {
    updateProgress({ blockId: block.id, action });
  };

  // Обрезка текста для предпросмотра
  const getShortTextContent = (text: string | null, maxLength = 100) => {
    if (!text) return "Нет текстового описания.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const IconComponent = categoryIcons[block.file.mainCategory.toUpperCase()];

  return (
    <Card
      className={
        "cursor-pointer hover:shadow-lg transition-shadow duration-200"
      }
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-center">
          {IconComponent && (
            <IconComponent className="h-6 w-6 mr-2 text-gray-600" />
          )}
          <CardTitle className="text-lg">{block.blockTitle}</CardTitle>
        </div>
        {block.pathTitles && block.pathTitles.length > 0 && (
          <CardDescription className="text-xs text-gray-500 mt-1">
            {block.pathTitles.join(" / ")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-2">
          {getShortTextContent(block.textContent)}
        </p>
        {block.codeContent && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <p className="font-semibold">
              Есть блок кода ({block.codeLanguage || "не указан"})
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-gray-500">
        <div className="flex justify-between items-center w-full mb-2">
          <div>
            <Badge variant="outline" className="mr-2">
              {block.file.mainCategory}
            </Badge>
            <Badge variant="secondary">{block.file.subCategory}</Badge>
          </div>
          <span className="text-gray-400">ID: {block.id.slice(0, 6)}..</span>
        </div>
        <div className="flex items-center justify-between w-full mt-1 pt-2 border-t">
          <div className="flex items-center">
            {Array.from({ length: block.currentUserSolvedCount || 0 }).map(
              (_, i) => (
                <Check
                  key={i}
                  className="h-5 w-5 text-green-500 mr-1 transition-all duration-300 ease-in-out opacity-100 scale-100"
                />
              )
            )}
            {(block.currentUserSolvedCount || 0) === 0 && (
              <span className="text-xs text-gray-400 italic">Не решено</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="icon"
              variant="outline"
              className="progress-button h-7 w-7 p-0"
              onClick={() => handleProgressChange("decrement")}
              disabled={
                isUpdatingProgress || (block.currentUserSolvedCount || 0) === 0
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="progress-button h-7 w-7 p-0"
              onClick={() => handleProgressChange("increment")}
              disabled={isUpdatingProgress}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
