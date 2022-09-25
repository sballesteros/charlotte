import React from 'react';

import styles from './visually-hidden.module.css';

type VisuallyHiddenProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

/**
 * Helper for accessibility (children can be read by screen reader but are not visible)
 */
export default function VisuallyHidden<C extends React.ElementType = 'span'>({
  as,
  children,
  ...others
}: VisuallyHiddenProps<C>) {
  const Comp = as || 'span';
  return (
    <Comp className={styles.hidden} {...others}>
      {children}
    </Comp>
  );
}
