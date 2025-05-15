import {
  Card as MantineCard,
  CardProps as MantineCardProps,
  CardSectionProps as MantineCardSectionProps,
  ElementProps,
} from "@mantine/core";
import React from "react";

// Добавляем ElementProps для поддержки onClick и других HTML атрибутов
export interface CardProps
  extends MantineCardProps,
    ElementProps<"div", keyof MantineCardProps> {}

export interface CustomCardSectionProps extends MantineCardSectionProps {
  children?: React.ReactNode;
} // Для единообразия, если понадобится кастомизация

const CardRoot: React.FC<CardProps> = (props) => {
  return <MantineCard {...props} />;
};

const CardSection: React.FC<CustomCardSectionProps> = (props) => {
  return <MantineCard.Section {...props} />;
};

// Экспортируем Card как объект с CardRoot и CardSection
// Это позволяет использовать <Card.Root> и <Card.Section>
export const Card = {
  Root: CardRoot,
  Section: CardSection,
};
