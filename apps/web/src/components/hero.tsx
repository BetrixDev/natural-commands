import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "./container";
import { TypeAnimation } from "./type-animation";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <Container className="relative z-20">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h1 className="mb-6 font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">
              <span className="text-purple-400">Simple Words</span> to
              <span className="text-purple-400"> Powerful Commands</span>
            </h1>

            <p className="mb-8 text-gray-300 text-xl leading-relaxed md:text-2xl">
              Natural Commands transforms your plain English into complex
              Minecraft commands instantly. Powered by advanced AI, it
              understands what you want to do and generates the right commands
              for you.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#download"
                className="rounded-md bg-purple-500 px-8 py-4 font-semibold text-lg text-white transition-colors hover:bg-purple-600"
              >
                Download Now
              </a>
              <a
                href="#examples"
                className="rounded-md bg-gray-700 px-8 py-4 font-semibold text-lg text-white transition-colors hover:bg-gray-600"
              >
                See Examples
              </a>
            </div>
          </div>

          <div
            className={`relative mx-auto max-w-3xl overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl transition-all delay-300 duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
              <div className="flex items-center space-x-2">
                <Terminal size={18} className="text-purple-400" />
                <span className="font-medium text-sm">Natural Commands</span>
              </div>
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>

            <div className="p-6 text-left font-mono text-sm">
              <div className="mb-4">
                <span className="text-green-400">&gt; </span>
                <TypeAnimation
                  text="Give me a diamond sword"
                  typingSpeed={20}
                  startDelay={500}
                  className="text-gray-200"
                />
              </div>

              <div className="overflow-x-auto rounded-md bg-gray-900/50 p-3 text-gray-300">
                <TypeAnimation
                  text="/give @p diamond_sword 1"
                  typingSpeed={20}
                  startDelay={1750}
                  className="text-purple-300"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
