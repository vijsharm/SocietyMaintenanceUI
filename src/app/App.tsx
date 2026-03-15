import { RouterProvider } from "react-router";
import { router } from "@/app/routes.tsx";
import { Toaster } from "@/app/components/ui/sonner";
import { AuthProvider } from "@/app/context/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}