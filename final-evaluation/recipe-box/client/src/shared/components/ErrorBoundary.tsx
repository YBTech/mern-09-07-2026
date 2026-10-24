import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// 考点: class component for error boundary
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // 考点: initial state for error tracking
    this.state = { hasError: false, error: null };
  }

  // 考点: static method to derive state from error
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // 考点: lifecycle method for error logging
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  // 考点: conditional rendering for error state
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          {/* 考点: page reload on error */}
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
