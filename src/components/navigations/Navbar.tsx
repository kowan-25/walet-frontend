'use client';

import Image from "next/image";
import Button from "../buttons/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { FaChevronDown } from "react-icons/fa";
import { LogOut, MailPlus } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { username, logout } = useUser();

  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  return (
    <div className="fixed top-0 w-full z-50">
      <nav
        className={`flex justify-between items-center px-[80px] py-3 ${scrolled ? "bg-accent-white-rock" : "bg-light"} transition-colors duration-200`}
      > 
        <Link href={"/"}>
          <Image
            src={'/logo/logo-walet.svg'}
            width={179}
            height={47}
            alt="Walet Logo"
            className="w-[180px] h-[80px]"
          />
        </Link>
        <div className="flex gap-6 items-center relative">
          {username ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-black px-4 py-2 justify-between font-light text-[18px]">
                Hello,<span className="!font-medium">{username}</span>
                <FaChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-10 w-[210px]">
                <button
                  onClick={() => router.push('/invitations')}
                  className="flex flex-row gap-2 items-center justify-start block w-full text-left px-8 py-4 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer rounded-t-md"
                >
                  <MailPlus size={16}/> Lihat Undangan
                </button>
                <button
                  onClick={handleLogout}
                  className="flex flex-row gap-2 items-center justify-start block w-full text-left text-red-500 px-8 py-4 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer rounded-b-md"
                >
                  <LogOut size={16}/>Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-8">
              <Link href={"/register"}>
                <Button
                  size="small"
                  asChild
                  className="bg-accent-dirty-blue text-white !font-medium rounded-2xl w-[130px]"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href={"/login"}>
                <Button
                  size="small"
                  asChild
                  className="border-accent-dirty-blue border-2 bg-transparent text-accent-dirty-blue !font-medium rounded-2xl w-[130px]"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
