import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/activity")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/activity"!</div>;
}
