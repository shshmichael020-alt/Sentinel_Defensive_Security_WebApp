import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../src/components/common/ErrorBoundary';

const BombComponent = (): never => {
  throw new Error('Simulated UI crash for testing');
};

describe('ErrorBoundary component', () => {
  it('renders accessible alert fallback with reload button when a child throws', () => {
    render(
      <ErrorBoundary>
        <BombComponent />
      </ErrorBoundary>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload application/i })).toBeInTheDocument();
  });
});
