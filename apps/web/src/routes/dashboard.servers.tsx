import { defineStepper } from "@/components/stepper";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc, trpcClient } from "@/utils/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CheckIcon,
  CircleAlertIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  PlusIcon,
  RefreshCwIcon,
  ServerIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/servers")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      trpc.serverConnection.getServerConnectionsForUser.queryOptions(),
    );
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const [isConnectServerDialogOpen, setIsConnectServerDialogOpen] =
    useState(false);

  const { data: serverConnections, isLoading: isLoadingServerConnections } =
    useQuery(trpc.serverConnection.getServerConnectionsForUser.queryOptions());

  const { mutate: addServerConnection } = useMutation(
    trpc.serverConnection.addServerConnection.mutationOptions({
      onSuccess: () => {
        setIsConnectServerDialogOpen(false);
        queryClient.invalidateQueries(
          trpc.serverConnection.getServerConnectionsForUser.queryFilter(),
        );
      },
    }),
  );

  const connectServerForm = useForm({
    defaultValues: {
      serverName: "",
      serverAddress: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
      addServerConnection(value);
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-end gap-1">
              Connected Servers
              <span className="font-normal text-xs">
                - ({serverConnections?.length} / 1) connections available
              </span>
            </CardTitle>
            <CardDescription>
              Manage your Minecraft server connections where you can generate
              commands.
            </CardDescription>
          </div>
          <Dialog
            open={isConnectServerDialogOpen}
            onOpenChange={setIsConnectServerDialogOpen}
          >
            <DialogTrigger asChild>
              <Button disabled={(serverConnections?.length ?? 0) >= 1}>
                <PlusIcon /> Connect a Server
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect a Minecraft Server</DialogTitle>
                <DialogDescription className="text-xs">
                  The credentials you enter here are only to help you identify
                  the server later. You will be asked to verify the server's
                  connection using a command with the plugin after continuing
                  from this dialog.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  connectServerForm.handleSubmit();
                }}
              >
                <connectServerForm.Field
                  name="serverName"
                  children={(field) => (
                    <div className="space-y-1">
                      <Label htmlFor={field.name}>Server Name</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="My Minecraft Server"
                      />
                    </div>
                  )}
                />
                <connectServerForm.Field
                  name="serverAddress"
                  children={(field) => (
                    <div className="space-y-1">
                      <Label htmlFor={field.name}>Server Address</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="mc.example.com"
                      />
                      <p className="text-muted-foreground text-xs">
                        Accuracy important to ensure connection status is
                        correct in dashboard.
                      </p>
                    </div>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button className="grow" variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="grow" type="submit">
                    Connect Server
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {serverConnections?.length === 1 && (
          <div className="mb-2 text-muted-foreground text-sm">
            You have hit the maximum number of connections. Upgrade your plan to
            add more.{" "}
            <span className="text-primary underline">
              <Link to="/dashboard/settings/billing" preload="intent">
                Upgrade
              </Link>
            </span>
          </div>
        )}
        <hr className="mb-3" />
        {isLoadingServerConnections ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2Icon className="h-5 w-5 animate-spin" /> Loading server
            connections...
          </div>
        ) : (
          <>
            {serverConnections?.length === 0 ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                No server connections found. Please click the Connect a Server
                button above to get started.
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {serverConnections?.map((serverConnection) => (
                  <ServerConnectionCard
                    key={serverConnection.id}
                    serverConnection={serverConnection}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

const { Stepper: VerificationStepper } = defineStepper(
  {
    id: "copy-token-to-config",
    label: "Copy Token to Config",
  },
  {
    id: "verify-server",
    label: "Verify Server",
  },
  {
    id: "check-verification",
    label: "Check Verification",
  },
);

type ServerConnection = {
  id: string;
  name: string;
  address: string;
  isVerified: boolean;
  token: string;
};

function ServerConnectionCard({
  serverConnection,
}: {
  serverConnection: ServerConnection;
}) {
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: serverStatus } = useQuery(
    trpc.getMinecraftServerStatus.queryOptions(
      {
        connectionId: serverConnection.id,
      },
      {
        staleTime: 1000 * 60 * 5,
      },
    ),
  );

  const { mutate: deleteServerConnection } = useMutation(
    trpc.serverConnection.deleteServerConnection.mutationOptions({
      onMutate: (payload) => {
        queryClient.setQueryData(
          trpc.serverConnection.getServerConnectionsForUser.queryKey(),
          (old) => {
            return old?.filter(
              (connection: ServerConnection) =>
                connection.id !== payload.connectionId,
            );
          },
        );
      },
    }),
  );

  const { mutate: refreshServerConnectionToken } = useMutation(
    trpc.serverConnection.refreshServerConnectionToken.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.serverConnection.getServerConnectionsForUser.queryFilter(),
        );
        toast.success("Token refreshed");
      },
    }),
  );

  const { mutate: checkVerification, isPending: isCheckingVerification } =
    useMutation({
      mutationFn: async () => {
        return trpcClient.serverConnection.getVerificationStatus.query({
          connectionId: serverConnection.id,
        });
      },
      onSuccess: (data) => {
        if (data.isVerified) {
          toast.success("Server verified");
          queryClient.invalidateQueries(
            trpc.serverConnection.getServerConnectionsForUser.queryFilter(),
          );
        } else {
          toast.error("Server not verified", {
            description:
              "Please verify the server by running the command in the Verify Server step.",
          });
        }
      },
    });

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this connection?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() =>
                  deleteServerConnection({ connectionId: serverConnection.id })
                }
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex grow flex-col gap-2 rounded-lg bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
              {serverStatus?.iconBase64 ? (
                <img
                  src={serverStatus.iconBase64}
                  alt="Server Icon"
                  className="inset-0 h-full w-full rounded-md object-cover"
                />
              ) : (
                <ServerIcon />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{serverConnection.name}</p>
                <div className="flex gap-2">
                  {serverStatus ? (
                    serverStatus.isOnline ? (
                      <Badge variant="success">Online</Badge>
                    ) : (
                      <Badge variant="neutral">Offline</Badge>
                    )
                  ) : (
                    <Badge variant="neutral" className="w-14 animate-pulse" />
                  )}
                  {serverConnection.isVerified ? (
                    <Badge variant="successOutline">
                      <CheckIcon /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="warningOutline">
                      <XIcon /> Not Verified
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                {serverConnection.address}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(serverConnection.token);
                  toast.success("Token copied to clipboard");
                }}
              >
                <CopyIcon /> Copy Token
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  refreshServerConnectionToken({
                    connectionId: serverConnection.id,
                  });
                }}
              >
                <RefreshCwIcon /> Refresh Token
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <TrashIcon className="text-destructive" /> Delete Connection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!serverConnection.isVerified && (
          <div className="bg-gray-900">
            <div className="space-y-4 rounded-b-lg border-yellow-500/20 border-t bg-yellow-500/15 p-3">
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <CircleAlertIcon className="h-4 w-4" /> This server is not yet
                verified
              </div>
              <VerificationStepper.Provider variant="vertical">
                {({ methods }) => (
                  <>
                    <VerificationStepper.Navigation>
                      {methods.all.map((step) => (
                        <VerificationStepper.Step
                          key={step.id}
                          of={step.id}
                          onClick={() => methods.goTo(step.id)}
                        >
                          <VerificationStepper.Title className="text-sm">
                            {step.label}
                          </VerificationStepper.Title>
                          {methods.when(step.id, () => (
                            <VerificationStepper.Panel>
                              {step.id === "copy-token-to-config" && (
                                <div className="mb-4 flex flex-col gap-2 rounded-lg border border-accent bg-background/90 p-4">
                                  <p className="flex items-center gap-1 text-sm">
                                    Copy and paste the token into the plugin's
                                    configuration file located in the
                                    <span className="rounded-md bg-muted px-1 py-0.5 text-xs">
                                      plugins/NaturalCommands/config.yml
                                    </span>
                                    file.
                                  </p>
                                  <ServerTokenView
                                    token={serverConnection.token}
                                  />
                                </div>
                              )}
                              {step.id === "verify-server" && (
                                <div className="mb-4 flex flex-col gap-2 rounded-lg border border-accent bg-background/90 p-4">
                                  <p className="text-sm">
                                    Verify the server by running the following
                                    command.
                                  </p>
                                  <CodeWithCopyButton
                                    code={`/verify ${serverConnection.id}`}
                                  />
                                </div>
                              )}
                              {step.id === "check-verification" && (
                                <div className="mb-4 flex flex-col gap-2 rounded-lg border border-accent bg-background/90 p-4">
                                  <p className="text-sm">
                                    Click the Check Verification button below to
                                    ensure the server has been verified.
                                  </p>
                                </div>
                              )}
                              <VerificationStepper.Controls>
                                {
                                  <Button
                                    variant="outline"
                                    onClick={methods.prev}
                                    disabled={
                                      methods.isFirst || isCheckingVerification
                                    }
                                  >
                                    Previous
                                  </Button>
                                }
                                <Button
                                  onClick={
                                    methods.isLast
                                      ? () => checkVerification()
                                      : methods.next
                                  }
                                  disabled={isCheckingVerification}
                                >
                                  {methods.isLast
                                    ? "Check Verification"
                                    : "Next"}
                                </Button>
                              </VerificationStepper.Controls>
                            </VerificationStepper.Panel>
                          ))}
                        </VerificationStepper.Step>
                      ))}
                    </VerificationStepper.Navigation>
                  </>
                )}
              </VerificationStepper.Provider>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
function ServerTokenView({ token }: { token: string }) {
  const [showToken, setShowToken] = useState(false);
  const hiddenToken = `${token.slice(0, 8)}...`;

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted">
      <div className="flex-1 pl-2 font-mono text-sm">
        {showToken ? token : hiddenToken}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowToken(!showToken)}
      >
        {showToken ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(token);
          toast.success("Token copied to clipboard");
        }}
      >
        <CopyIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

function CodeWithCopyButton({ code }: { code: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-muted">
      <code className="rounded-md bg-muted px-1 py-0.5 text-xs">{code}</code>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(code);
          toast.success("Copied to clipboard");
        }}
      >
        <CopyIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
