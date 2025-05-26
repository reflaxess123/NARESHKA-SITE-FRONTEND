import { DueCard, Rating } from "@/entities/theory-card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { motion } from "framer-motion";
import { RotateCcw, Target, TrendingUp } from "lucide-react";
import React, { useState } from "react";

interface SpacedRepetitionCardProps {
  card: DueCard;
  intervals: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
  onReview: (rating: Rating) => void;
  isLoading?: boolean;
  className?: string;
}

const flipVariants = {
  front: { rotateY: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  back: { rotateY: 180, transition: { duration: 0.6, ease: "easeInOut" } },
};

const cardStyle = {
  transformStyle: "preserve-3d" as const,
};

// CSS стили для ограничения размера изображений в карточках
const cardContentStyles = `
  .theory-card-content img {
    max-width: 100% !important;
    max-height: 200px !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
    border-radius: 4px;
    margin: 8px auto;
    display: block;
  }
  
  .theory-card-content pre {
    max-width: 100% !important;
    overflow-x: auto !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  }
  
  .theory-card-content code {
    max-width: 100% !important;
    overflow-x: auto !important;
    word-wrap: break-word !important;
  }
  
  .theory-card-content table {
    max-width: 100% !important;
    overflow-x: auto !important;
    display: block !important;
    white-space: nowrap !important;
  }
`;

export const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({
  card,
  intervals,
  onReview,
  isLoading = false,
  className = "",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!isLoading) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleReview = (rating: Rating) => {
    if (!isLoading) {
      onReview(rating);
      setIsFlipped(false); // Сбрасываем карточку для следующей
    }
  };

  const formatInterval = (days: number): string => {
    if (days < 1) {
      const minutes = Math.round(days * 24 * 60);
      return `${minutes} мин`;
    } else if (days === 1) {
      return "1 день";
    } else if (days < 30) {
      return `${Math.round(days)} дн.`;
    } else if (days < 365) {
      const months = Math.round(days / 30);
      return `${months} мес.`;
    } else {
      const years = Math.round(days / 365);
      return `${years} г.`;
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "LEARNING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEW":
        return "bg-green-100 text-green-800";
      case "RELEARNING":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cardContentStyles }} />
      <div className={`relative w-full h-96 perspective-1000 ${className}`}>
        <motion.div
          className="relative w-full h-full"
          variants={flipVariants}
          animate={isFlipped ? "back" : "front"}
          style={cardStyle}
        >
          {/* Лицевая сторона - Вопрос */}
          {!isFlipped && (
            <Card
              className="absolute inset-0 w-full h-full border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              onClick={handleFlip}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-2">
                    <Badge variant="outline" className="w-fit">
                      {card.category}
                    </Badge>
                    {card.subCategory && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        {card.subCategory}
                      </Badge>
                    )}
                    <Badge
                      className={`w-fit text-xs ${getStateColor(card.cardState)}`}
                    >
                      {card.cardState}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                    {card.isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        Просрочено
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>Повторений: {card.reviewCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Сложность: {card.easeFactor.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <div
                    className="text-center prose prose-sm max-w-none theory-card-content"
                    dangerouslySetInnerHTML={{ __html: card.questionBlock }}
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <RotateCcw className="w-3 h-3" />
                    Нажмите для просмотра ответа
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Обратная сторона - Ответ и оценки */}
          {isFlipped && (
            <Card
              className="absolute inset-0 w-full h-full border-2 border-green-500/20 hover:border-green-500/40 transition-colors cursor-pointer"
              onClick={handleFlip}
              style={{ transform: "rotateY(180deg)" }}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-green-50 text-green-600">Ответ</Badge>
                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {card.tags
                        .slice(0, 3)
                        .map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto mb-4">
                  <div
                    className="prose prose-sm max-w-none theory-card-content"
                    dangerouslySetInnerHTML={{ __html: card.answerBlock }}
                  />
                </div>

                {/* Кнопки оценки */}
                <div className="space-y-3">
                  <div className="text-center text-xs text-muted-foreground mb-2">
                    Как хорошо вы знали ответ?
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview("again");
                      }}
                      disabled={isLoading}
                      className="flex flex-col h-auto py-2"
                    >
                      <span className="font-medium">Забыл</span>
                      <span className="text-xs opacity-80">
                        {formatInterval(intervals.again)}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview("hard");
                      }}
                      disabled={isLoading}
                      className="flex flex-col h-auto py-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <span className="font-medium">Сложно</span>
                      <span className="text-xs opacity-80">
                        {formatInterval(intervals.hard)}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview("good");
                      }}
                      disabled={isLoading}
                      className="flex flex-col h-auto py-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <span className="font-medium">Хорошо</span>
                      <span className="text-xs opacity-80">
                        {formatInterval(intervals.good)}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview("easy");
                      }}
                      disabled={isLoading}
                      className="flex flex-col h-auto py-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <span className="font-medium">Легко</span>
                      <span className="text-xs opacity-80">
                        {formatInterval(intervals.easy)}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
};
