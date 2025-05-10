import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";
import { queryClient, trpc } from "./utils/trpc";
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: { trpc, queryClient },
  defaultNotFoundComponent: () => <NotFound />,
  Wrap: function WrapComponent({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
