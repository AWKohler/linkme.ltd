import Hero from "@/components/Hero";
import Features from "@/components/Features";
// import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
// import { Button } from "@heroui/react";
import { LandingNavbar } from "@/components/landing-navbar";

export default function Home() {

  // const { isSignedIn } = useAuth();

  return (
    <div className="">
      <LandingNavbar/>
      <Hero/>
      <Features/>
    </div>
  );
}
