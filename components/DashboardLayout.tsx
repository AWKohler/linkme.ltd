'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  Button,
  Card,
  CardBody
} from '@heroui/react';
import { 
  BarChart3, 
  QrCode, 
  Menu, 
  X 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
    { name: 'QR Codes', href: '/codes', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80 bg-white rounded-br-2xl">

      <div className={`h-screen
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-900">
            Linkme.ltd
          </Link>
          <Button
            isIconOnly
            variant="ghost"
            className="lg:hidden"
            onPress={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

        {/* <div className="space-y-4 py-4 flex flex-col h-full bg-[#212126] text-white rounded-r-2xl z-10">

        <div className="px-5 py-2 flex-1">


          <Link href="/dashboard" className="flex items-center pl-2 mb-14">

            <h1 className={"text-3xl font-bold tracking-tighter"}>
              Linkme.ltd
            </h1>

          </Link>

          <div className="space-y-1">

            <p className={"ml-1 text-zinc-400 text-xs"}>
              Overview
            </p>

        


            <p className={"ml-1 text-zinc-400 text-xs pt-8"}>
              DataLake
            </p>

          </div>


          <p className={"ml-1 text-zinc-400 text-xs pt-8"}>
              Settings
            </p>

          


        </div>


      </div> */}

      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top navbar */}
        <Navbar 
          maxWidth="full" 
          className="bg-white border-b border-gray-200"
          height="4rem"
        >
          <NavbarContent justify="start">
            
            <Button
              isIconOnly
              variant="ghost"
              className="lg:hidden"
              onPress={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </NavbarContent>
          
          <NavbarContent justify="end">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </NavbarContent>
        </Navbar>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { UserButton } from '@clerk/nextjs';
// import { 
//   Navbar, 
//   NavbarBrand, 
//   NavbarContent, 
//   Button,
//   Card,
//   CardBody
// } from '@heroui/react';
// import { 
//   BarChart3, 
//   QrCode, 
//   Menu, 
//   X 
// } from 'lucide-react';

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const pathname = usePathname();

//   const navigation = [
//     { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
//     { name: 'QR Codes', href: '/codes', icon: QrCode },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex"> {/* Use flex to contain sidebar and main content */}
//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0 lg:static lg:inset-0
//       `}>
//         <div className="flex items-center justify-between h-16 px-6 border-b">
//           <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
//             link.ltd
//           </Link>
//           <Button
//             isIconOnly
//             variant="ghost"
//             className="lg:hidden"
//             onPress={() => setSidebarOpen(false)}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>
        
//         <nav className="mt-8 px-4">
//           <div className="space-y-2">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               const isActive = pathname === item.href;
              
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`
//                     flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
//                     ${isActive 
//                       ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }
//                   `}
//                 >
//                   <Icon className="mr-3 h-5 w-5" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 lg:pl-64"> {/* Make main content take remaining space */}
//         {/* Top navbar */}
//         <Navbar 
//           maxWidth="full" 
//           className="bg-white border-b border-gray-200"
//           height="4rem"
//         >
//           <NavbarContent justify="start">
            
//             <Button
//               isIconOnly
//               variant="ghost"
//               className="lg:hidden"
//               onPress={() => setSidebarOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </NavbarContent>
          
//           <NavbarContent justify="end">
//             <UserButton 
//               appearance={{
//                 elements: {
//                   avatarBox: "w-8 h-8"
//                 }
//               }}
//             />
//           </NavbarContent>
//         </Navbar>

//         {/* Page content */}
//         <main className="flex-1">
//           <div className="p-6">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

{/* Sidebar */}
      // <div className={`h-screen
      //   fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      //   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      //   lg:translate-x-0 lg:static lg:inset-0
      // `}>
      //   <div className="flex items-center justify-between h-16 px-6 border-b">
      //     <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
      //       link.ltd
      //     </Link>
      //     <Button
      //       isIconOnly
      //       variant="ghost"
      //       className="lg:hidden"
      //       onPress={() => setSidebarOpen(false)}
      //     >
      //       <X className="h-5 w-5" />
      //     </Button>
      //   </div>
        
      //   <nav className="mt-8 px-4">
      //     <div className="space-y-2">
      //       {navigation.map((item) => {
      //         const Icon = item.icon;
      //         const isActive = pathname === item.href;
              
      //         return (
      //           <Link
      //             key={item.name}
      //             href={item.href}
      //             className={`
      //               flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
      //               ${isActive 
      //                 ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
      //                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      //               }
      //             `}
      //           >
      //             <Icon className="mr-3 h-5 w-5" />
      //             {item.name}
      //           </Link>
      //         );
      //       })}
      //     </div>
      //   </nav>
      // </div>