// src/main.tsx

import { createRoot } from "react-dom/client";
import { Routes } from "@generouted/react-router";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
  >
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Routes />
    </ConvexProviderWithClerk>
  </ClerkProvider>
);
