import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className = "w-12 h-12" }: SpinnerProps) => (
  <div className={`${className} border-t-4 border-blue-500 rounded-full animate-spin`}></div>
);

export default Spinner;
