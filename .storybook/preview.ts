import type { Preview } from '@storybook/react-vite'
import '../src/style/index.css'

import { useEffect } from 'react';
import ThemeDecorator from './ThemeDecorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f3f4f6' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      return (
        <ThemeDecorator theme={context.globals.theme}>
          <Story />
        </ThemeDecorator>
      );
    },
  ],

// ThemeDecorator component for dark mode toggle
import React from 'react';
type ThemeDecoratorProps = {
  theme: string;
  children: React.ReactNode;
};
const ThemeDecorator: React.FC<ThemeDecoratorProps> = ({ theme, children }) => {
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        { name: 'light', value: '#f3f4f6' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeDecorator theme={context.globals.theme}>
        <Story />
      </ThemeDecorator>
    ),