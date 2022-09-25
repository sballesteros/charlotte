import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './button.module.css';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  className?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, ...others },
  ref
) {
  let isIcon = true;
  React.Children.forEach(children, function (child) {
    if (
      !(
        child &&
        typeof child === 'object' &&
        'type' in child &&
        child.type === 'svg'
      )
    ) {
      isIcon = false;
    }
  });

  return (
    <button
      ref={ref}
      className={classNames(styles.button, className, {
        [styles.isIcon]: isIcon,
      })}
      {...others}
    >
      {children}
    </button>
  );
});

export default Button;
