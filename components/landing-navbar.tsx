"use client";

import {Epilogue, Montserrat} from 'next/font/google'
import Image from "next/image"
import Link from "next/link"
import { useAuth, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useScroll from "@/lib/hooks/use-scroll";

import React from "react";
import dynamic from "next/dynamic";



export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();
   const scrolled = useScroll(50);
   // const scrolled = true;

    const components: { title: string; href: string; description: string }[] = [
        {
            title: "Alert Dialog",
            href: "/docs/primitives/alert-dialog",
            description:
                "A modal dialog that interrupts the user with important content and expects a response.",
        },
        {
            title: "Hover Card",
            href: "/docs/primitives/hover-card",
            description:
                "For sighted users to preview content available behind a link.",
        },
        {
            title: "Progress",
            href: "/docs/primitives/progress",
            description:
                "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
        },
        {
            title: "Scroll-area",
            href: "/docs/primitives/scroll-area",
            description: "Visually or semantically separates content.",
        },
        {
            title: "Tabs",
            href: "/docs/primitives/tabs",
            description:
                "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        },
        {
            title: "Tooltip",
            href: "/docs/primitives/tooltip",
            description:
                "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        },
    ]

    return (

      <div className={"pb-2"}>
     

        <div
            // className={`z-11 fixed p-4 top-0 w-full flex items-center justify-between ${
            // className={`// z-11 fixed p-2 pr-8 top-0 w-full flex items-center justify-between ${
            className={`z-11 fixed p-2 pr-8 top-0 w-full flex items-center justify-between ${

              scrolled
                ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
                : "bg-white/0"
            } z-30 transition-all`}
        >



            <Link href="/" className="flex items-center justify-center">
            

                <div className={"text-4xl font-semibold text-black tracking-tighter"}>
            
                    {/*<div className={"text-white bg-[#8c52ff] rounded-t-full rounded-l-full px-3.5 py-2.5"}>*/}
                    <h1 className={"text-[#8c52ff] font-bold px-3.5 py-2.5 ml-4"}>
                        Linkme.ltd
                    </h1>
                </div>

            </Link>

    

            <div className="flex items-center gap-x-2">
                {isSignedIn ? (
                    <>
                        <Link href="/dashboard">
                            <Button variant="outline" className="rounded-full text-lg py-5 px-2 lg:px-4">
                                Dashboard
                            </Button>
                        </Link>
                        <SignOutButton>
                            <Button variant="outline" className="rounded-full text-lg py-5 px-2 lg:px-4">
                                Sign Out
                            </Button>
                        </SignOutButton>
                    </>
                ) : (
                    <>
                        <SignInButton>
                            <Button variant="outline" className="rounded-full text-lg py-5 px-2 lg:px-4">
                                Sign In
                            </Button>
                        </SignInButton>
                        <Link href="/sign-up">
                            <Button className="rounded-full text-lg py-5 px-2 lg:px-4 bg-[#8c52ff] hover:bg-[#7a47e6]">
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
            </div>


        </div>
      </div>



  )
}