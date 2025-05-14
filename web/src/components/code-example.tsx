"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "./type-animation";

type CodeExampleProps = {
  input: string;
  output: string;
};

export const CodeExample = ({ input, output }: CodeExampleProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
  }, [input, output]);

  return (
    <div>
      <div className="mb-6">
        <h4 className="mb-2 font-medium text-muted-foreground text-sm">
          You Type:
        </h4>
        <div className="rounded-md border border-input bg-secondary p-4 font-mono text-sm">
          {isAnimating ? (
            <TypeAnimation
              text={input}
              typingSpeed={10}
              className="text-primary"
            />
          ) : (
            <span className="text-primary">{input}</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-secondary-foreground text-sm">
          Natural Commands AI Generates:
        </h4>
        <div className="overflow-x-auto rounded-md border border-input bg-secondary p-4 font-mono text-sm">
          {isAnimating ? (
            <TypeAnimation
              text={output}
              typingSpeed={10}
              startDelay={input.length * 30 + 500}
              className="text-primary"
            />
          ) : (
            <span className="whitespace-pre-wrap text-primary-foreground">
              {output}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
