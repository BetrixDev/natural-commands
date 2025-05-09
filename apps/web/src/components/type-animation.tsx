import { useEffect, useState } from "react";

type TypeAnimationProps = {
  text: string;
  typingSpeed: number;
  startDelay?: number;
  className?: string;
};

export const TypeAnimation = ({
  text,
  typingSpeed,
  startDelay = 0,
  className = "",
}: TypeAnimationProps) => {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTyping = setTimeout(() => {
      setStarted(true);
    }, startDelay);

    return () => clearTimeout(startTyping);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [text, typingSpeed, started]);

  return <span className={className}>{displayText}</span>;
};
