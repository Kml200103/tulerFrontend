import Error from "./Error";
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { isError: false };
  }

  static getDerivedStateFromError() {
    return { isError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ isError: false });
  };

  render() {
    if (this.state.isError) {
      return (
        <Error
          title="Error Occurred!"
          subTitle="Error Occurred! Please try again later."
          buttonText="Refresh"
          onClick={() => {
            // Use the navigate function to refresh the page
            window.location.reload(); // This will refresh the page
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
