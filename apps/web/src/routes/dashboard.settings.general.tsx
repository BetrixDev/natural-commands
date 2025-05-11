import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon, TrashIcon } from "lucide-react";
import { FaDiscord, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings/general")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      trpc.user.getLinkedAccounts.queryOptions(),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const { data: linkedAccounts } = useQuery(
    trpc.user.getLinkedAccounts.queryOptions(),
  );

  const isLinkedToGoogle = linkedAccounts?.some(
    (account) => account.provider === "google",
  );

  const isLinkedToDiscord = linkedAccounts?.some(
    (account) => account.provider === "discord",
  );

  const { mutate: linkSocialProvider, isPending: isLinking } = useMutation({
    mutationFn: async (provider: "google" | "discord") => {
      const origin = window.location.origin;

      const { data, error } = await authClient.linkSocial({
        provider,
        callbackURL: `${origin}/dashboard/settings/general`,
      });

      if (error) {
        throw { message: error.message ?? error.statusText };
      }

      return data;
    },
    onError: () => {
      toast.error("Failed to link social provider", {
        description: "Please try again later",
      });
    },
  });

  const { mutate: unlinkSocialProvider, isPending: isUnlinking } = useMutation({
    mutationFn: async (providerId: string) => {
      const { data, error } = await authClient.unlinkAccount({
        providerId,
      });

      if (error) {
        throw { message: error.message ?? error.statusText };
      }

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.deleteUser();

      if (error) {
        throw error;
      }

      return data;
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
          <CardContent className="mt-4 p-0">
            <div className="flex flex-col gap-4 rounded-lg border p-4">
              <div>
                <h1 className="font-semibold">Connected Accounts</h1>
                <p className="text-xs">Manage your connected accounts</p>
              </div>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <FaGoogle className="text-accent" /> Google
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="w-24"
                      disabled={isLinkedToGoogle || isLinking || isUnlinking}
                      onClick={() => linkSocialProvider("google")}
                    >
                      {isLinking ? "Linking..." : "Link"}
                    </Button>
                    <Button
                      className="w-24"
                      variant="destructive"
                      disabled={!isLinkedToGoogle || isUnlinking || isLinking}
                      onClick={() => unlinkSocialProvider("google")}
                    >
                      Unlink
                    </Button>
                  </div>
                </li>
                <hr />
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaDiscord className="text-accent" /> Discord
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="w-24"
                      disabled={isLinkedToDiscord || isLinking || isUnlinking}
                      onClick={() => linkSocialProvider("discord")}
                    >
                      {isLinking ? "Linking..." : "Link"}
                    </Button>
                    <Button
                      className="w-24"
                      variant="destructive"
                      disabled={!isLinkedToDiscord || isUnlinking || isLinking}
                      onClick={() => unlinkSocialProvider("discord")}
                    >
                      Unlink
                    </Button>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your personal data and privacy settings
          </CardDescription>
          <CardContent className="mt-4 flex flex-col gap-4 p-0">
            <div className="flex h-16 items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">Download Your Data</p>
                <p className="text-xs">
                  Request a copy of all your personal data in a machine-readable
                  format
                </p>
              </div>
              <Button variant="outline">
                <DownloadIcon /> Export Data
              </Button>
            </div>
            <div className="flex h-16 items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">Delete Your Account</p>
                <p className="text-xs">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <TrashIcon /> Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Your Account</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. All your data will be
                      permanently deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button disabled={isDeleting} variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => deleteAccount()}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
