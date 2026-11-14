import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unexpected rendering error.',
    };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#060917] px-6 text-center text-[#F8FAFC]">
          <p className="font-editorial-mono text-xs uppercase tracking-widest text-[#60A5FA]">
            Portfolio Recovery
          </p>
          <h1 className="mt-3 font-editorial-display text-2xl font-bold sm:text-3xl">
            Unable to render view
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/70">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 cursor-pointer rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            Reload Portfolio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
