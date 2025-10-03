"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="w-screen mt-20 flex flex-col items-center justify-center">
      <Image src={"/coxy dora.png"} width={200} height={200} alt={"Coxy Logo"} className="rounded-full" />
      <p className="sen mt-4 text-xl font-bold text-coxy-primary">
        Page Not Found
      </p>
      <p className="sen mt-2 text-muted-foreground">
        The domain you're looking for doesn't exist in our database.
      </p>
      <p className="sen mt-4">
        Click&nbsp;
        <span
          className="underline text-coxy-primary font-semibold cursor-pointer hover:scale-105 transform transition"
          onClick={() => {
            router.push("/");
          }}
        >
          here
        </span>
        &nbsp;to go back home.
      </p>
    </div>
  );
}
