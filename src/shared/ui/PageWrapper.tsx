import React, { PropsWithChildren, HTMLAttributes } from "react";

// Расширяем HTMLAttributes для поддержки стандартных атрибутов div
interface PageWrapperProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  // className уже есть в HTMLAttributes, но мы можем его оставить для явности или специфичных нужд
  // className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = "", // Сохраняем значение по умолчанию, если className не передан
  ...rest // rest теперь будет содержать все остальные HTML атрибуты
}) => {
  // Объединяем базовый класс p-4 с переданным className
  const combinedClassName = `p-4 ${className}`.trim();

  return (
    <div className={combinedClassName} {...rest}>
      {children}
    </div>
  );
};
