import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BotMessageSquareIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Container } from "./container";
import { Button } from "./ui/button";

export const Header = ({
  className,
  showNav = true,
}: {
  className?: string;
  showNav?: boolean;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: session } = useSession();

  const { mutate: signOut } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message, { description: "Please try again later" });
    },
    onSuccess: () => {
      toast.success("Signed out successfully");
    },
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm transition-colors duration-300",
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <BotMessageSquareIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Natural Commands</span>
            </div>
          </Link>
          {showNav && (
            <>
              <nav className="hidden items-center space-x-4 md:flex">
                {session?.user === undefined && (
                  <Button variant="outline">
                    <Link to="/sign-in" className="">
                      Sign In
                    </Link>
                  </Button>
                )}
                {session?.user !== undefined && (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/dashboard/servers">Dashboard</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </>
                )}
                <Button
                  className="bg-accent px-4 py-2 text-white transition-colors hover:bg-accent/90"
                  asChild
                >
                  <a href="#download">Download</a>
                </Button>
              </nav>
              <button
                type="button"
                className="text-gray-100 md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </>
          )}
        </div>
        {mobileMenuOpen && (
          <nav className="flex flex-col space-y-4 border-gray-700 border-t py-4 md:hidden">
            {session?.user === undefined && (
              <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
            {session?.user !== undefined && (
              <>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/servers">Dashboard</Link>
                </Button>
                <Button variant="destructive" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            )}
            <Button
              asChild
              className="w-full bg-accent text-white hover:bg-accent/90"
              onClick={() => setMobileMenuOpen(false)}
            >
              <a href="#download">Download</a>
            </Button>
          </nav>
        )}
      </Container>
    </header>
  );
};
