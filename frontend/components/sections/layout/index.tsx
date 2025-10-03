"use client";


import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEnvironmentStore } from "@/components/context";
import CommandMenu from "./command-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import getSub from "@/lib/supabase/getSub";
import { useToast } from "@/hooks/use-toast";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setPaid } = useEnvironmentStore((store) => store);
  const router = useRouter();
  const { } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
  }, []);
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 space-y-4 sm:space-y-0">
        <div
          className="flex items-center space-x-3 sm:space-x-4 select-none cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/coxy dora.png"
            alt="Coxy Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <p className="font-bold text-lg sm:text-2xl crypto-futuristic tracking-widest text-coxy-primary">
            Coxy
          </p>
        </div>

        <CommandMenu />

        <div className="hidden md:flex space-y-4 sm:space-y-0 sm:space-x-4">

          <Button
            variant="ghost"
            className="hover:bg-transparent hover:border-[1px] hover:border-white transform transition hover:scale-105"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <p className="sen text-sm sm:text-md font-bold">📊 Dashboard</p>
            <div className="w-2 h-2 bg-iris-primary rounded-full animate-pulse ml-2"></div>
          </Button>

          <Button
            variant="ghost"
            className="hover:bg-transparent hover:border-[1px] hover:border-white transform transition hover:scale-105"
            onClick={() => {
              router.push("/domain-monitor");
            }}
          >
            <p className="sen text-sm sm:text-md font-bold">🌐 Domain Monitor</p>
          </Button>

          <Button
            variant="ghost"
            className="hidden lg:flex hover:bg-transparent hover:border-[1px] hover:border-white transform transition hover:scale-105"
            onClick={() => {
              window.open("https://x.com/CoxyDo1130", "_blank");
            }}
          >
            <p className="sen text-sm sm:text-md font-bold">Follow on</p>
            <Image
              src="/x.png"
              alt="logo"
              width={20}
              height={20}
              className="rounded-full"
            />
          </Button>

        </div>
      </div>
      <div className="flex md:hidden mt-4 justify-center md:justify-start ">

        <Button
          variant="ghost"
          className="hover:bg-transparent hover:border-[1px] hover:border-white transform transition hover:scale-105"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <p className="sen text-sm sm:text-md font-bold">
            Live Dashboard
          </p>
          <div className="w-2 h-2 bg-iris-primary rounded-full animate-pulse ml-2"></div>
        </Button>


        <Button
          variant="ghost"
          className="hidden lg:flex hover:bg-transparent hover:border-[1px] hover:border-white transform transition hover:scale-105"
          onClick={() => {
            window.open("https://x.com/CoxyDo1130", "_blank");
          }}
        >
          <p className="sen text-sm sm:text-md font-bold">Follow on</p>
          <Image
            src="/x.png"
            alt="logo"
            width={20}
            height={20}
            className="rounded-full"
          />
        </Button>

      </div>

      <div className="w-full max-w-full overflow-x-hidden">{children}</div>
    </div>
  );
}
