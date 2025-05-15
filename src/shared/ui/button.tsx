import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  createPolymorphicComponent,
} from "@mantine/core";
import React from "react";
import cx from "clsx";

// Типы пропсов для нашего компонента Button.
// Это в основном MantineButtonProps, но мы используем createPolymorphicComponent,
// поэтому TypeScript будет правильно обрабатывать проп 'component'.
// Если бы у нас были свои кастомные пропсы, мы бы их сюда добавили.
// interface InternalButtonProps extends MantineButtonProps { /* custom props here */ }
// Пока что InternalButtonProps будет таким же, как MantineButtonProps.
type InternalButtonProps = MantineButtonProps;

const _Button = React.forwardRef<HTMLButtonElement, InternalButtonProps>(
  ({ className, children, ...props }, ref) => {
    // Просто передаем все пропсы в MantineButton
    // className от пользователя объединяется с любыми другими классами, если это будет необходимо в будущем.
    return (
      <MantineButton
        {...props}
        ref={ref}
        className={cx(className)} // cx здесь для будущей гибкости, если понадобится добавлять классы
      >
        {children}
      </MantineButton>
    );
  }
);

_Button.displayName = "SharedButton";

export const Button = createPolymorphicComponent<"button", InternalButtonProps>(
  _Button
);

export type ButtonProps = React.ComponentProps<typeof Button>;
