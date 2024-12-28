import React, {Suspense} from "react";
import Image from 'next/image'

const LandingLayout = ({
                           children
                       }: {
    children: React.ReactNode;
}) => {
    return (
        // <html lang={"en"} className={"bg-[#2d2d2a]"}>s
        // <html lang={"en"} className={"bg-[#1a1a1a]"}>
        <html lang={"en"} className={"bg-gray-100"}>

        <body className={"overflow-hidden"}>


        <main className="flex w-full flex-col items-center justify-center">

            <div className="mx-auto -full w-full">
                {children}
            </div>

        </main>
        </body>
        </html>
    );
}

export default LandingLayout;