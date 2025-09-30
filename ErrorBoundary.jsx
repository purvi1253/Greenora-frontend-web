import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🌿 Oops! Something went wrong</h2>
            <p>We apologize for the inconvenience. Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary>Technical Details</summary>
              <pre style={{ fontSize: '0.8rem', background: '#f5f5f5', padding: '0.5rem' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;