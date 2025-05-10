import { Link } from "@tanstack/react-router";
import { Header } from "./header";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-background">
      <Header className="absolute top-0 left-0 w-full" />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-4xl">404</h1>
          <p className="text-lg">Page not found</p>
        </div>
        <Button variant="outline">
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
