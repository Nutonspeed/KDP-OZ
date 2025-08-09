"use client"

import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to the console or a monitoring service
    console.error("ErrorBoundary caught an error", error, errorInfo)
    // Example: send error to monitoring service
    // monitoringService.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold">Something went wrong.</h2>
          <p className="text-sm">Please try again later.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

