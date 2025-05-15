import { useUpdateContentProgress } from "@/features/content";
import { Badge, Card } from "@/shared/ui";
import { ActionIcon, Group, Paper, Text, Title, Divider } from "@mantine/core";
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
    <Card.Root
      shadow="sm"
      padding={0}
      radius="md"
      withBorder
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Section inheritPadding py="md" px="md">
        <Group wrap="nowrap">
          {IconComponent && (
            <IconComponent
              size={24}
              style={{
                marginRight: "8px",
                color: "var(--mantine-color-gray-6)",
              }}
            />
          )}
          <Title order={4} lineClamp={1}>
            {block.blockTitle}
          </Title>
        </Group>
        {block.pathTitles && block.pathTitles.length > 0 && (
          <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
            {block.pathTitles.join(" / ")}
          </Text>
        )}
      </Card.Section>

      <Card.Section inheritPadding py="sm" px="md">
        <Text size="sm" c="gray.7" mb="sm" lineClamp={3}>
          {getShortTextContent(block.textContent)}
        </Text>
        {block.codeContent && (
          <Paper p="xs" radius="sm" mt="sm" withBorder>
            <Text size="xs" fw={600}>
              Есть блок кода ({block.codeLanguage || "не указан"})
            </Text>
          </Paper>
        )}
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="sm" px="md">
        <Group justify="space-between" w="100%" mb="sm">
          <Group gap="xs">
            <Badge variant="outline">{block.file.mainCategory}</Badge>
            <Badge variant="light">{block.file.subCategory}</Badge>
          </Group>
          <Text size="xs" c="gray.5">
            ID: {block.id.slice(0, 6)}..
          </Text>
        </Group>
        <Group justify="space-between" w="100%" mt="xs">
          <Group gap={4}>
            {Array.from({ length: block.currentUserSolvedCount || 0 }).map(
              (_, i) => (
                <Check
                  key={i}
                  size={20}
                  color="var(--mantine-color-green-6)"
                  style={{ marginRight: "2px" }}
                />
              )
            )}
            {(block.currentUserSolvedCount || 0) === 0 && (
              <Text size="xs" c="dimmed" fs="italic">
                Не решено
              </Text>
            )}
          </Group>
          <Group gap="xs">
            <ActionIcon
              size="sm"
              variant="outline"
              className="progress-button"
              onClick={() => handleProgressChange("decrement")}
              disabled={
                isUpdatingProgress || (block.currentUserSolvedCount || 0) === 0
              }
              aria-label="Уменьшить прогресс"
            >
              <Minus size={16} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="outline"
              className="progress-button"
              onClick={() => handleProgressChange("increment")}
              disabled={isUpdatingProgress}
              aria-label="Увеличить прогресс"
            >
              <Plus size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>
    </Card.Root>
  );
};
