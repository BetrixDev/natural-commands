import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FaDiscord, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (provider: "discord" | "google") => {
      const origin = window.location.origin;

      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: `${origin}/dashboard/servers`,
      });

      if (error) {
        throw { message: error.message ?? error.statusText };
      }

      return data;
    },
    onError: (error: { message: string }) => {
      toast.error(error.message, { description: "Please try again later" });
    },
  });

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-background">
      <Header className="absolute top-0 left-0 w-full" showNav={false} />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription className="text-primary">
            Sign in using on of the social providers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="bg-accent/90 text-white hover:bg-accent/80"
            disabled
            onClick={() => signIn("google")}
          >
            <FaGoogle /> Sign in with Google
          </Button>
          <Button
            className="bg-accent/90 text-white hover:bg-accent/80"
            disabled={isPending}
            onClick={() => signIn("discord")}
          >
            <FaDiscord /> Sign in with Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
