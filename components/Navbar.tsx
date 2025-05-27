//  "use client"

// import React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { QrCode } from "lucide-react"

// export default function Navbar() {
//   const pathname = usePathname()
  
//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-blue-950/40 border-b border-white/10">
//       <div className="container mx-auto px-4 md:px-6">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo/Wordmark */}
//           <Link href="/" className="flex items-center">
//             <span className="text-xl font-bold italic tracking-tighter text-white">
//               Linkme<span className="text-blue-300">.ltd</span>
//             </span>
//           </Link>

//           {/* Navigation */}
//           <nav className="flex items-center space-x-4">
//             <Link href="/" className={`text-sm font-medium transition-colors hover:text-blue-300 ${pathname === '/' ? 'text-blue-300' : 'text-white/80'}`}>
//               Home
//             </Link>
//             <Button asChild variant="ghost" className="bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-full">
//               <Link href="/qr" className="flex items-center gap-2">
//                 <QrCode className="h-4 w-4" />
//                 <span>Create QR Code</span>
//               </Link>
//             </Button>
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }

"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-blue-950/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Wordmark */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold italic tracking-tighter text-white">
              Linkme<span className="text-blue-300">.ltd</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-blue-300 ${pathname === '/' ? 'text-blue-300' : 'text-white/90'}`}>
              Home
            </Link>
            {isSignedIn && (
              <>
                <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-blue-300 ${pathname.startsWith('/dashboard') ? 'text-blue-300' : 'text-white/90'}`}>
                  Dashboard
                </Link>
                <Link href="/analytics" className={`text-sm font-medium transition-colors hover:text-blue-300 ${pathname.startsWith('/analytics') ? 'text-blue-300' : 'text-white/90'}`}>
                  Analytics
                </Link>
              </>
            )}
            <Button asChild variant="ghost" className="bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-full">
              <Link href="/qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <span>Create QR Code</span>
              </Link>
            </Button>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-full">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}