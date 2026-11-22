import { Component, type ReactNode } from 'react';
import { OctagonX, RefreshCw } from 'lucide-react';

interface Props {
  readonly children: ReactNode;
  readonly fallbackMessage?: string | undefined;
}

interface State {
  readonly hasError: boolean;
  readonly errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-[240px] flex flex-col items-center justify-center p-6 text-center rounded-lg border border-red-200 bg-red-50 text-red-900 m-4"
        >
          <OctagonX size={36} className="text-red-600 mb-3" aria-hidden="true" />
          <h2 className="text-base font-semibold mb-1">An unexpected error occurred</h2>
          <p className="text-xs text-red-700 max-w-md mb-4 leading-relaxed">
            {this.props.fallbackMessage ??
              'Sentinel encountered an issue rendering this section safely. No personal data was saved or lost.'}
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
          >
            <RefreshCw size={12} aria-hidden="true" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
