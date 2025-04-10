import React from "react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between py-4 mx-auto px-4">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-700">HANDYMAN</div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-gray-600 hover:text-blue-700">
            Home
          </a>
          <a href="/categories" className="text-gray-600 hover:text-blue-700">
            Categories
          </a>
          <a href="/take-job" className="text-gray-600 hover:text-blue-700">
            Jobs
          </a>
          <a href="/about-us" className="text-gray-600 hover:text-blue-700">
            About Us
          </a>
        </nav>
        <div>
          <Avatar className="cursor-pointer inline-flex">
            <AvatarImage src="/path/to/profile-picture.jpg" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="hidden md:inline-flex mr-2">
            <a href="/login">Login</a>
          </Button>
          <Button className="md:inline-flex">Hire Now</Button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;

// import React, { useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = () => {
//     // In a real app, this would be replaced with actual authentication logic
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // In a real app, this would be replaced with actual logout logic
//     setIsLoggedIn(false);
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
//       <div className="container flex items-center justify-between py-4 mx-auto px-4">
//         <div className="flex items-center">
//           <div className="text-xl font-bold text-blue-700">HANDYMAN</div>
//         </div>
//         <nav className="hidden md:flex items-center gap-8">
//           <a href="#" className="text-gray-600 hover:text-blue-700">
//             Home
//           </a>
//           <a href="#" className="text-gray-600 hover:text-blue-700">
//             Categories
//           </a>
//           <a href="#" className="text-gray-600 hover:text-blue-700">
//             Jobs
//           </a>
//           <a href="#" className="text-gray-600 hover:text-blue-700">
//             About Us
//           </a>
//         </nav>
//         <div className="flex items-center">
//           {!isLoggedIn ? (
//             <>
//               <Button
//                 variant="outline"
//                 className="hidden md:inline-flex mr-2"
//                 onClick={handleLogin}
//               >
//                 Login
//               </Button>
//               <Button className="md:inline-flex">Hire Now</Button>
//             </>
//           ) : (
//             <div className="flex items-center space-x-4">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Avatar className="cursor-pointer">
//                     <AvatarImage
//                       src="/path/to/profile-picture.jpg"
//                       alt="Profile"
//                     />
//                     <AvatarFallback>JD</AvatarFallback>
//                   </Avatar>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>Profile</DropdownMenuItem>
//                   <DropdownMenuItem>My Jobs</DropdownMenuItem>
//                   <DropdownMenuItem>Settings</DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className="text-red-600 focus:text-red-600"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <Button className="md:inline-flex">Hire Now</Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
