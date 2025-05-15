import {
  useContentBlockDetails,
  useUpdateContentProgress,
} from "@/features/content";
import { Badge, Button, Modal, Skeleton } from "@/shared/ui";
import {
  ActionIcon,
  Text,
  Title,
  Group,
  Stack,
  Alert,
  Box,
  Divider,
  ScrollAreaAutosize,
  TypographyStylesProvider,
  VisuallyHidden,
} from "@mantine/core";
import React from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
// Выберите стиль по вкусу. Например, atomOneDark. Полный список:
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_STYLES_PRISM.MD
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// Языки, которые нужно поддерживать. Можно добавлять по мере необходимости.
// Базовые языки (markup, css, clike, javascript) обычно включены по умолчанию или с PrismAsyncLight
// Для других, например, jsx, typescript, python, json, bash и т.д.:
import { Minus, Plus, AlertCircle } from "lucide-react";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";

// Регистрация языков
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("javascript", jsx); // javascript часто реиспользует jsx или js
SyntaxHighlighter.registerLanguage("js", jsx);
SyntaxHighlighter.registerLanguage("ts", typescript);

interface ContentBlockModalProps {
  blockId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContentBlockModal: React.FC<ContentBlockModalProps> = ({
  blockId,
  isOpen,
  onClose,
}) => {
  const {
    data: block,
    isLoading,
    isError,
    error,
  } = useContentBlockDetails(blockId);

  const { mutate: updateProgress, isPending: isUpdatingProgress } =
    useUpdateContentProgress();

  // console.log(
  //   "ContentBlockModal рендер: blockId",
  //   blockId,
  //   "загрузка:",
  //   isLoading,
  //   "данные блока:",
  //   block
  // );

  if (!isOpen) return null;

  if (!blockId && isOpen) {
    return null;
  }

  if (isError) {
    return (
      <Modal opened={isOpen} onClose={onClose} title="Ошибка" centered>
        <Alert
          icon={<AlertCircle size={16} />}
          title="Ошибка загрузки"
          color="red"
          variant="light"
          mb="md"
        >
          Не удалось загрузить детали блока: {error?.message}
        </Alert>
        <Group justify="flex-end">
          <Button onClick={onClose} variant="outline">
            Закрыть
          </Button>
        </Group>
      </Modal>
    );
  }

  const handleProgressChange = (action: "increment" | "decrement") => {
    if (blockId) {
      updateProgress({ blockId, action });
    }
  };

  // Заголовок модального окна
  const modalTitle = block
    ? block.blockTitle
    : isLoading
      ? "Загрузка..."
      : "Информация о блоке";

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="4xl"
      centered
      scrollAreaComponent={ScrollAreaAutosize}
    >
      {isLoading && !block && (
        <VisuallyHidden>
          <Title order={2}>Загрузка информации о блоке</Title>
        </VisuallyHidden>
      )}
      {block && block.pathTitles && block.pathTitles.length > 0 && (
        <Text size="sm" c="dimmed" mb="sm">
          Путь: {block.pathTitles.join(" / ")}
        </Text>
      )}

      <Box
        style={{
          maxHeight: "calc(80vh - 160px)",
          marginTop: "var(--mantine-spacing-md)",
          marginBottom: "var(--mantine-spacing-md)",
        }}
      >
        {isLoading && !block ? (
          <Stack gap="md" mt="md">
            <Skeleton height={20} width="75%" mb="xs" />
            <Skeleton height={16} width="50%" />
            <Divider my="sm" />
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} width="80%" />
            <Skeleton height={160} mt="md" />
            <Skeleton height={16} width="33%" mt="md" />
            <Group mt="sm">
              <Skeleton height={24} width={96} />
              <Skeleton height={24} width={80} />
            </Group>
          </Stack>
        ) : block ? (
          <Stack gap="lg">
            {block.textContent && (
              <TypographyStylesProvider>
                <Box dangerouslySetInnerHTML={{ __html: block.textContent }} />
              </TypographyStylesProvider>
            )}

            {block.codeContent && (
              <Box>
                <Text size="sm" fw={600} mb={4}>
                  Код ({block.codeLanguage || "не указан"}):
                  {block.codeFoldTitle && (
                    <Text span c="dimmed" fw={400}>
                      ({block.codeFoldTitle})
                    </Text>
                  )}
                </Text>
                <SyntaxHighlighter
                  language={block.codeLanguage || "text"}
                  style={atomDark}
                  showLineNumbers
                  wrapLines
                  customStyle={{
                    borderRadius: "var(--mantine-radius-md)",
                    padding: "var(--mantine-spacing-md)",
                    fontSize: "var(--mantine-font-size-sm)",
                  }}
                >
                  {String(block.codeContent)}
                </SyntaxHighlighter>
              </Box>
            )}

            {block.extractedUrls && block.extractedUrls.length > 0 && (
              <Box>
                <Title order={4} mb="sm">
                  Извлеченные URL:
                </Title>
                <Stack
                  component="ul"
                  gap="xs"
                  style={{
                    listStyle: "disc",
                    paddingLeft: "var(--mantine-spacing-lg)",
                  }}
                >
                  {block.extractedUrls.map((url, index) => (
                    <li key={index}>
                      <Text
                        size="sm"
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="link"
                      >
                        {url}
                      </Text>
                    </li>
                  ))}
                </Stack>
              </Box>
            )}
            <Divider />
            <Box fz="xs" c="dimmed">
              <Text>
                <strong>ID Файла:</strong> {block.fileId}
              </Text>
              <Text>
                <strong>Путь к файлу (WebDAV):</strong> {block.file.webdavPath}
              </Text>
              <Group gap="xs" my={4}>
                <strong>Категории:</strong>
                <Badge variant="outline">{block.file.mainCategory}</Badge> /
                <Badge variant="light">{block.file.subCategory}</Badge>
              </Group>
              <Divider my="sm" />
              <Group align="center">
                <Text fw={500}>Решено раз:</Text>
                <Text fw={700} mr="sm">
                  {block.currentUserSolvedCount || 0}
                </Text>
                <ActionIcon.Group>
                  <ActionIcon
                    size="md"
                    variant="default"
                    onClick={() => handleProgressChange("decrement")}
                    disabled={
                      isUpdatingProgress ||
                      (block.currentUserSolvedCount || 0) === 0
                    }
                    aria-label="Уменьшить прогресс"
                  >
                    <Minus size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="md"
                    variant="default"
                    onClick={() => handleProgressChange("increment")}
                    disabled={isUpdatingProgress}
                    aria-label="Увеличить прогресс"
                  >
                    <Plus size={16} />
                  </ActionIcon>
                </ActionIcon.Group>
              </Group>
              <Text mt="sm">
                <strong>Создано:</strong>{" "}
                {new Date(block.createdAt).toLocaleString()}
              </Text>
              <Text>
                <strong>Обновлено:</strong>{" "}
                {new Date(block.updatedAt).toLocaleString()}
              </Text>
            </Box>
          </Stack>
        ) : null}
      </Box>
      {!isLoading && block && (
        <Group justify="flex-end" mt="md">
          <Button onClick={onClose} variant="outline">
            Закрыть
          </Button>
        </Group>
      )}
      {isLoading && !block && (
        <Group justify="flex-end" mt="md">
          <Skeleton height={36} width={100} />
        </Group>
      )}
    </Modal>
  );
};
