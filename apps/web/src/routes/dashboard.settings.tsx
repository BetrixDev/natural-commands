import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useRouterState({ select: (s) => s.location });

  const splitPath = location.pathname.split("/");

  const currentTab = splitPath[splitPath.indexOf("settings") + 1];

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue={currentTab}>
        <TabsList className="w-full">
          <TabsTrigger value="general" asChild>
            <Link to="/dashboard/settings/general">General</Link>
          </TabsTrigger>
          <TabsTrigger value="billing" asChild>
            <Link to="/dashboard/settings/billing">Billing</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
