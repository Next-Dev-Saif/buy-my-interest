import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1800px] px-6 md:px-12 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
