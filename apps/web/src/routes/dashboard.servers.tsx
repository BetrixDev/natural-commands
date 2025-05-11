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
import { trpc } from "@/utils/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Loader2Icon,
  PlusIcon,
  ServerIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/servers")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      trpc.serverConnection.getServerConnectionsForUser.queryOptions()
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
          trpc.serverConnection.getServerConnectionsForUser.queryFilter()
        );
      },
    })
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
        <hr className="mb-6" />
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
      }
    )
  );

  const { mutate: deleteServerConnection } = useMutation(
    trpc.serverConnection.deleteServerConnection.mutationOptions({
      onMutate: (payload) => {
        queryClient.setQueryData(
          trpc.serverConnection.getServerConnectionsForUser.queryKey(),
          (old) => {
            return old?.filter(
              (connection: ServerConnection) =>
                connection.id !== payload.connectionId
            );
          }
        );
      },
    })
  );

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
      <div className="flex grow flex-col gap-2 rounded-lg bg-background p-4">
        <div className="flex items-center justify-between">
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
              <DropdownMenuItem>
                <CopyIcon /> Copy Token
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
      </div>
    </>
  );
}
