import { TheoryCard } from "@/entities/theory-card";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { motion } from "framer-motion";
import { Maximize2, ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FlippableCardProps {
  card: TheoryCard;
  isFlipped: boolean;
  onFlip: () => void;
  onProgressUpdate: (action: "increment" | "decrement") => void;
  className?: string;
}

const flipVariants = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export const FlippableCard: React.FC<FlippableCardProps> = ({
  card,
  isFlipped,
  onFlip,
  onProgressUpdate,
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contentSide, setContentSide] = useState<"front" | "back">("front");

  // Управление сменой контента в середине анимации
  useEffect(() => {
    if (isFlipped !== (contentSide === "back")) {
      // Задержка в половину времени анимации (0.3 секунды из 0.6)
      const timer = setTimeout(() => {
        setContentSide(isFlipped ? "back" : "front");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isFlipped, contentSide]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      onFlip();
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProgressUpdate("increment");
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProgressUpdate("decrement");
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Проверяем, что клик не был по кнопке или интерактивному элементу
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-no-flip]")) {
      return;
    }
    onFlip();
  };

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const handleFullscreenClose = () => {
    setIsFullscreen(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Закрываем модальное окно при клике вне карточки
    if (e.target === e.currentTarget) {
      handleFullscreenClose();
    }
  };

  // Обработка ESC для закрытия полноэкранного режима
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        handleFullscreenClose();
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  const renderCardContent = (isFullscreenMode: boolean = false) => {
    const contentClass = isFullscreenMode
      ? "theory-card-content-fullscreen"
      : "theory-card-content";
    const cardHeight = isFullscreenMode ? "h-auto min-h-[400px]" : "h-full";
    const cardPadding = isFullscreenMode ? "p-8" : "p-6";

    return (
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        variants={flipVariants}
        animate={isFlipped ? "back" : "front"}
      >
        {/* Лицевая сторона - Вопрос */}
        {contentSide === "front" && (
          <Card
            className={`absolute inset-0 w-full ${cardHeight} border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer`}
            onClick={isFullscreenMode ? handleCardClick : handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Карточка: ${card.category}. Нажмите для переворота.`}
          >
            <CardContent className={`${cardPadding} h-full flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col gap-1 ">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {card.category}
                  </span>
                  {card.subCategory && (
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      {card.subCategory}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Решено: {card.currentUserSolvedCount}
                  </span>
                  {!isFullscreenMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleFullscreenToggle}
                      className="h-8 w-8 p-0 relative z-10"
                      data-no-flip
                      title="Развернуть на весь экран"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  )}
                  {/* <RotateCcw className="w-4 h-4 text-muted-foreground" /> */}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div
                  className={`text-center prose prose-sm max-w-none ${contentClass}`}
                  dangerouslySetInnerHTML={{ __html: card.questionBlock }}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Нажмите для просмотра ответа
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Обратная сторона - Ответ */}
        {contentSide === "back" && (
          <Card
            className={`absolute inset-0 w-full ${cardHeight} border-2 border-green-500/20 hover:border-green-500/40 transition-colors cursor-pointer [transform:rotateY(180deg)]`}
            onClick={isFullscreenMode ? handleCardClick : handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Нажмите для возврата к вопросу"
          >
            <CardContent className={`${cardPadding} h-full flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    Ответ
                  </span>
                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {card.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs text-muted-foreground bg-muted/50 px-1 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1" data-no-flip>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecrement}
                    className="h-8 w-8 p-0 relative z-10"
                    disabled={card.currentUserSolvedCount === 0}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground mx-2">
                    {card.currentUserSolvedCount}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleIncrement}
                    className="h-8 w-8 p-0 relative z-10"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  {!isFullscreenMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleFullscreenToggle}
                      className="h-8 w-8 p-0 relative z-10"
                      title="Развернуть на весь экран"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div
                  className={`prose prose-sm max-w-none ${contentClass}`}
                  dangerouslySetInnerHTML={{ __html: card.answerBlock }}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Нажмите для возврата к вопросу
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    );
  };

  // Модальное окно через портал - максимально простое
  const modalContent = isFullscreen ? (
    <div
      className="fixed inset-0 bg-black/80 z-[99999] flex justify-center p-5"
      onClick={handleModalClick}
    >
      {/* Кнопка закрытия */}
      <div
        className="absolute top-5 right-5 w-10 h-10 bg-white/20 rounded-full cursor-pointer flex items-center justify-center z-[100000]"
        onClick={handleFullscreenClose}
      >
        <span className="text-white text-xl">×</span>
      </div>

      {/* Контейнер карточки */}
      <div className="w-full max-w-[min(90vw,800px)] flex items-center justify-center">
        {renderCardContent(true)}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Обычная карточка */}
      <div className={`relative w-full h-80 perspective-1000 ${className}`}>
        {renderCardContent(false)}
      </div>

      {/* Модальное окно через портал */}
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
