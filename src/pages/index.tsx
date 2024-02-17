import { SignInButton } from "@clerk/clerk-react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";
import { useUser } from "@clerk/clerk-react";

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  console.log(user)
  
  return (
    <div className="">
      {isAuthenticated ? "Logged in" : "Logged out or still loading"}
      <Authenticated>Logged in</Authenticated>
      <Unauthenticated>Logged out</Unauthenticated>
      <AuthLoading>Still loading</AuthLoading>
      return <span>Logged in as {user?.fullName}</span>;

      
      <SignInButton mode="modal" />
    </div>
  );
}
