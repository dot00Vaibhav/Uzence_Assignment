import React, { useEffect } from 'react';

interface ThemeDecoratorProps {
  theme: string;
  children: React.ReactNode;
}

const ThemeDecorator: React.FC<ThemeDecoratorProps> = ({ theme, children }) => {
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  return <>{children}</>;
};

export default ThemeDecorator;
