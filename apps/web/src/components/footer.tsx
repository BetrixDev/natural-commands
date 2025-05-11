import { BotMessageSquareIcon, Github, Twitter } from "lucide-react";
import { Container } from "./container";

export const Footer = () => {
  return (
    <footer className="border-input border-t bg-primary-foreground/50 py-12">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center space-x-2">
              <BotMessageSquareIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Natural Commands</span>
            </div>
            <p className="mb-4 text-muted-foreground">
              Transforming Minecraft commands through the power of AI.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/BetrixDev/natural-commands"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github size={20} />
              </a>
              <a
                href="https://x.com/BetrixDev"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.commandcraft.ai"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://docs.commandcraft.ai/commands"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Command References
                </a>
              </li>
              <li>
                <a
                  href="https://docs.commandcraft.ai/tutorials"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="https://docs.commandcraft.ai/api"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-lg">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/natural-commands"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Discord Server
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/natural-commands/natural-commands"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Forum
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/natural-commands/natural-commands"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/natural-commands/natural-commands/issues"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Bug Reports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.commandcraft.ai/legal/terms-of-service"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://docs.commandcraft.ai/legal/privacy-policy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://docs.commandcraft.ai/legal/license"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-input border-t pt-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Natural Commands.</p>
          <p className="mt-2">
            Not affiliated with Mojang Studios or Microsoft. Minecraft is a
            trademark of Mojang Studios.
          </p>
        </div>
      </Container>
    </footer>
  );
};
