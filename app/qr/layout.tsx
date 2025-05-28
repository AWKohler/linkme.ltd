import React, {Suspense} from "react";
import Image from 'next/image'
import { DivideCircle } from "lucide-react";

const LandingLayout = ({
                           children
                       }: {
    children: React.ReactNode;
}) => {
    return (
        // <html lang={"en"} className={"bg-[#2d2d2a]"}>s
        // <html lang={"en"} className={"bg-[#1a1a1a]"}>
        <div lang={"en"} className={"bg-gray-100"}>

        <div className={"overflow-hidden"}>


        <main className="flex w-full flex-col items-center justify-center">

            <div className="mx-auto -full w-full">
                {children}
            </div>

        </main>
        </div>
        </div>
    );
}

export default LandingLayout;