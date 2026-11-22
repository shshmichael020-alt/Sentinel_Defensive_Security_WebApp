import type { FC } from 'react';

export const SkipLink: FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xs font-semibold"
    >
      Skip to main content
    </a>
  );
};
