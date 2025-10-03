import Image from "next/image";
import { Button } from "./ui/button";
import { useEnvironmentStore } from "./context";
import { useToast } from "@/hooks/use-toast";
// import addSub from "@/lib/supabase/addSub";

export default function UnlockNow({ text }: { text: string }) {
  const { setPaid, bonkBalance, balance, walletAddress } = useEnvironmentStore(
    (store) => store
  );
  const payEnabled = true;
  const { toast } = useToast();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p className="sen text-muted-foreground font-semibold mt-6 mb-4 text-center">
        {text}
        <div className="flex  justify-center items-center">
          <p>at 499,999&nbsp;</p>
          <Image
            src={"/bonk.png"}
            width={25}
            height={25}
            alt="bonk"
            className="rounded-full mr-2 ml-1"
          />
          <p>BONK</p>
          <p>/week</p>
        </div>
      </p>
      <Button
        className="flex bg-iris-primary hover:bg-iris-primary/80 transform transition hover:scale-105"
        onClick={async () => {
          if (walletAddress == "") {
            toast({
              title: "Wallet not connected",
              description: "Please connect your wallet first.",
            });
            return;
          }

          if (payEnabled) {
            console.log(bonkBalance);
            if (parseInt(bonkBalance) < parseInt("499999")) {
              toast({
                title: "Insufficient BONK Balance",
                description:
                  "Your balance is " +
                  parseInt(bonkBalance).toLocaleString() +
                  " BONK. You need 499,999 BONK to unlock this feature.",
              });
            } else if (parseInt(balance) < 1) {
              toast({
                title: "Insufficient SOL Balance",
                description:
                  "Your balance is " +
                  balance.toLocaleLowerCase() +
                  " SOL. You need at least 1 SOL to pay for gas.",
              });
            } else {
              // Payment functionality removed - no longer needed
              setPaid(true);
              toast({
                title: "Access Granted",
                description: "You have unlocked Coxy features.",
              });
            }
          } else setPaid(true);
        }}
      >
        <Image
          src={"/phantom.jpg"}
          width={25}
          height={25}
          className="rounded-full"
          alt="phantom"
        />
        <p className="sen font-semibold text-md">Pay with Phantom</p>{" "}
      </Button>
    </div>
  );
}
