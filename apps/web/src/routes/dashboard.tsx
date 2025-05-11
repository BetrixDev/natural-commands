import { Header } from "@/components/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { HistoryIcon, ServerIcon, SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session.data) {
      throw redirect({ to: "/sign-in" });
    }
  },
});

function RouteComponent() {
  const location = useRouterState({ select: (s) => s.location });

  const splitPath = location.pathname.split("/");

  const currentTab = splitPath[splitPath.indexOf("dashboard") + 1];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-8">
        <div>
          <h1 className="font-bold text-2xl">Dashboard</h1>
          <p>Manage your Minecraft command generation and server connections</p>
        </div>
        <Tabs defaultValue={currentTab}>
          <TabsList className="w-full">
            <TabsTrigger value="activity" asChild>
              <Link to="/dashboard/activity" preload="intent">
                <HistoryIcon /> Activity
              </Link>
            </TabsTrigger>
            <TabsTrigger value="servers" asChild>
              <Link to="/dashboard/servers" preload="intent">
                <ServerIcon /> Connected Servers
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Link to="/dashboard/settings/general" preload="intent">
                <SettingsIcon /> Account Settings
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Outlet />
      </main>
    </div>
  );
}
