import React, { Component } from 'react';
import '../styles/error-boundary';

interface ErrorBoundaryProps {
  componentName: string;
};

type ErrorBoundaryState = {
  error: any;
  errorInfo: any;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null
  };

  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { componentName } = this.props;

    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong with {componentName} component.</h2>
          <details>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
};