import { Check, Download, Server, Shield } from "lucide-react";
import Link from "next/link";

export const Compatibility = () => {
  return (
    <section id="compatibility" className="bg-card py-16">
      <div className="grid grid-cols-1 items-center gap-16 xl:grid-cols-2 xl:mx-24 lg:mx-12 md:mx-4 mx-2">
        <div>
          <h2 className="mb-6 font-bold text-3xl md:text-4xl">Ready To Use On Your Server</h2>
          <p className="mb-8 text-muted-foreground text-xl">
            Natural Commands is designed to work seamlessly with your existing Minecraft setup. Easy
            to install and compatible with most popular server versions.
          </p>

          <div className="mb-8 space-y-4">
            <div className="flex items-start space-x-3">
              <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Minecraft Version Support</h3>
                <p className="text-muted-foreground">
                  Works with Minecraft 1.21.5 and newer versions running on Paper MC
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Server className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Server Compatibility</h3>
                <p className="text-muted-foreground">
                  Compatible with Spigot, Paper, Bukkit, and Forge servers
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Permission System</h3>
                <p className="text-muted-foreground">
                  Built-in permission levels for server administrators to control access
                </p>
              </div>
            </div>
          </div>

          <div id="download" className="rounded-lg border border-input bg-card p-6">
            <h3 className="mb-4 font-bold text-2xl">Get Natural Commands Now</h3>
            <p className="mb-6 text-muted-foreground">
              Start transforming your Minecraft experience with the power of AI-generated commands.
            </p>
            <Link
              href="/docs"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="mr-2 h-5 w-5" />
              Get Started
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              By downloading, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
