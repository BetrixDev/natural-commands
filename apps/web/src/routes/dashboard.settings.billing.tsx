import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/settings/billing"!</div>;
}
