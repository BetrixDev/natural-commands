import { Terminal } from "lucide-react";
import { Container } from "./container";
import { TypeAnimation } from "./type-animation";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <Container className="relative z-20">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h1 className="mb-6 font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">
              <span className="text-primary">Simple Words</span>{" "}
              <span className="text-secondary">to</span>{" "}
              <span className="text-primary"> Powerful Commands</span>
            </h1>

            <p className="mb-8 text-gray-300 text-md leading-relaxed md:text-lg">
              Natural Commands transforms your plain English into complex
              Minecraft commands instantly. Powered by advanced AI, it
              understands what you want to do and generates the right commands
              for you.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button className="h-12 px-8 font-semibold text-lg">
                <a href="#download">Get Started</a>
              </Button>
              <Button
                variant="secondary"
                className="h-12 px-8 font-semibold text-lg"
              >
                <a href="#examples">See Examples</a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-lg border border-input bg-primary-foreground shadow-xl">
            <div className="flex items-center justify-between border-b bg-primary-foreground/50 px-4 py-2">
              <div className="flex items-center space-x-2">
                <Terminal size={18} className="text-accent" />
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
                  text="Give me an enchanted book with sharpness 5"
                  typingSpeed={20}
                  startDelay={500}
                  className="text-gray-200"
                />
              </div>

              <div className="overflow-x-auto rounded-md bg-background/50 p-3 text-gray-300">
                <TypeAnimation
                  text="give @s enchanted_book[stored_enchantments={'sharpness':5}] 1"
                  typingSpeed={20}
                  startDelay={1600}
                  className="text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
