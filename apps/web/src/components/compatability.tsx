import { Check, Download, Server, Shield } from "lucide-react";
import { Container } from "./container";

export const Compatibility = () => {
  return (
    <section id="compatibility" className="bg-gray-800/50 py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-bold text-3xl md:text-4xl">
              Ready To Use On Your Server
            </h2>
            <p className="mb-8 text-gray-300 text-xl">
              Natural Commands is designed to work seamlessly with your existing
              Minecraft setup. Easy to install and compatible with most popular
              server versions.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">
                    Minecraft Version Support
                  </h3>
                  <p className="text-gray-300">
                    Works with Minecraft 1.21.5 and newer versions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Server className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">
                    Server Compatibility
                  </h3>
                  <p className="text-gray-300">
                    Compatible with Spigot, Paper, Bukkit, and Forge servers
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Permission System</h3>
                  <p className="text-gray-300">
                    Built-in permission levels for server administrators to
                    control access
                  </p>
                </div>
              </div>
            </div>

            <div
              id="download"
              className="rounded-lg border border-gray-700 bg-gray-900 p-6"
            >
              <h3 className="mb-4 font-bold text-2xl">
                Get Natural Commands Now
              </h3>
              <p className="mb-6 text-gray-300">
                Start transforming your Minecraft experience with the power of
                AI-generated commands.
              </p>
              <a
                href="https://www.google.com"
                className="inline-flex items-center rounded-md bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent/90"
              >
                <Download className="mr-2 h-5 w-5" />
                Download v0.0.1
              </a>
              <p className="mt-4 text-gray-400 text-sm">
                By downloading, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Natural Commands in action"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 font-medium text-sm text-white">
                  Simple to Use
                </span>
                <h3 className="font-bold text-white text-xl md:text-2xl">
                  Transform Your Minecraft Experience
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
