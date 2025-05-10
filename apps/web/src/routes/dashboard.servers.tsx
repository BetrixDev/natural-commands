import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/servers")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/servers"!</div>;
}
