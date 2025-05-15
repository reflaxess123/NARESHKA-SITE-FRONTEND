import {
  useContentBlockDetails,
  useUpdateContentProgress,
} from "@/features/content";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Skeleton } from "@/shared/ui/skeleton";
import React from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
// Выберите стиль по вкусу. Например, atomOneDark. Полный список:
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_STYLES_PRISM.MD
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// Языки, которые нужно поддерживать. Можно добавлять по мере необходимости.
// Базовые языки (markup, css, clike, javascript) обычно включены по умолчанию или с PrismAsyncLight
// Для других, например, jsx, typescript, python, json, bash и т.д.:
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Minus, Plus } from "lucide-react";
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

  if (!isOpen) return null;

  if (!blockId && isOpen) {
    return null;
  }

  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ошибка</DialogTitle>
          </DialogHeader>
          <p className="text-red-500 py-4">
            Не удалось загрузить детали блока: {error?.message}
          </p>
          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleProgressChange = (action: "increment" | "decrement") => {
    if (blockId) {
      updateProgress({ blockId, action });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-4xl dark:border-gray-800 dark:bg-gray-950">
        <DialogHeader>
          {block ? (
            <>
              <DialogTitle className="text-2xl">{block.blockTitle}</DialogTitle>
              {block.pathTitles && block.pathTitles.length > 0 && (
                <DialogDescription className="text-sm text-muted-foreground">
                  Путь: {block.pathTitles.join(" / ")}
                </DialogDescription>
              )}
            </>
          ) : (
            <>
              <VisuallyHidden>
                <DialogTitle>
                  {isLoading
                    ? "Загрузка информации о блоке"
                    : "Информация о блоке"}
                </DialogTitle>
              </VisuallyHidden>
              {isLoading && (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              )}
            </>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-150px)] p-1 pr-4 mt-4 mb-4">
          {isLoading && !block ? (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-40 w-full mt-4" />
              <Skeleton className="h-4 w-1/3 mt-4" />
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ) : block ? (
            <>
              {block.textContent && (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: block.textContent }}
                />
              )}

              {block.codeContent && (
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-1">
                    Код ({block.codeLanguage || "не указан"}):
                    {block.codeFoldTitle && (
                      <span className="text-muted-foreground font-normal">
                        ({block.codeFoldTitle})
                      </span>
                    )}
                  </p>
                  <SyntaxHighlighter
                    language={block.codeLanguage || "text"}
                    style={atomDark}
                    showLineNumbers
                    wrapLines
                    className="rounded-md !p-4 !text-sm"
                  >
                    {String(block.codeContent)}
                  </SyntaxHighlighter>
                </div>
              )}

              {block.extractedUrls && block.extractedUrls.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-2">
                    Извлеченные URL:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {block.extractedUrls.map((url, index) => (
                      <li key={index} className="text-sm">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400 break-all"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs text-muted-foreground border-t pt-4 mt-auto">
                <p>
                  <strong>ID Файла:</strong> {block.fileId}
                </p>
                <p>
                  <strong>Путь к файлу (WebDAV):</strong>{" "}
                  {block.file.webdavPath}
                </p>
                <div>
                  <strong>Категории:</strong>{" "}
                  <Badge variant="outline">{block.file.mainCategory}</Badge> /{" "}
                  <Badge variant="secondary">{block.file.subCategory}</Badge>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <strong className="mr-2">Решено раз:</strong>
                  <span className="font-semibold mr-2">
                    {block.currentUserSolvedCount || 0}
                  </span>
                  <div className="inline-flex items-center space-x-1 ml-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => handleProgressChange("decrement")}
                      disabled={
                        isUpdatingProgress ||
                        (block.currentUserSolvedCount || 0) === 0
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => handleProgressChange("increment")}
                      disabled={isUpdatingProgress}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2">
                  <strong>Создано:</strong>{" "}
                  {new Date(block.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Обновлено:</strong>{" "}
                  {new Date(block.updatedAt).toLocaleString()}
                </p>
              </div>
            </>
          ) : null}
        </ScrollArea>

        <DialogFooter className="mt-4">
          {isLoading && !block ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <DialogClose asChild>
              <Button onClick={onClose} variant="outline">
                Закрыть
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
