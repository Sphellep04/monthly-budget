import { Component, type ReactNode } from "react";
import { ErrorFallback } from "./ErrorFallback";

interface State {
  error: Error | null;
}

/**
 * Wraps just the routed page content (not Sidebar) so a crash in one page
 * doesn't take navigation down with it - a plain React boundary rather than
 * a route-level errorComponent, since TanStack Router's errorComponent on
 * layoutRoute replaces that route's entire output, Sidebar included.
 */
export class PageErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          reset={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}
