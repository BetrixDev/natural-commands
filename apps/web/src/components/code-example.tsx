import { useEffect, useState } from "react";
import { TypeAnimation } from "./type-animation";

type CodeExampleProps = {
  input: string;
  output: string;
};

export const CodeExample = ({ input, output }: CodeExampleProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Reset animation when input/output changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsAnimating(true);
  }, [input, output]);

  return (
    <div>
      <div className="mb-6">
        <h4 className="mb-2 font-medium text-gray-400 text-sm">You Type:</h4>
        <div className="rounded-md border border-gray-700 bg-gray-900/50 p-4 font-mono text-sm">
          {isAnimating ? (
            <TypeAnimation
              text={input}
              typingSpeed={10}
              className="text-gray-200"
            />
          ) : (
            <span className="text-gray-200">{input}</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-gray-400 text-sm">
          Natural Commands AI Generates:
        </h4>
        <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-900/50 p-4 font-mono text-sm">
          {isAnimating ? (
            <TypeAnimation
              text={output}
              typingSpeed={10}
              startDelay={input.length * 30 + 500}
              className="text-primary"
            />
          ) : (
            <span className="whitespace-pre-wrap text-primary">{output}</span>
          )}
        </div>
      </div>
    </div>
  );
};
