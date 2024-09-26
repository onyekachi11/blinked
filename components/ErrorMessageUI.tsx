import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorMessageUI: React.FC = ({ children }: any) => {
  return <div className="error-message text-red-500 text-sm">{children}</div>;
};

export default ErrorMessageUI;
