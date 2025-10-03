import Image from "next/image";
import { Button } from "./ui/button";
import { useEnvironmentStore } from "./context";
import { useToast } from "@/hooks/use-toast";
// import addSub from "@/lib/supabase/addSub";

export default function UnlockNow({ text }: { text: string }) {
  const { setPaid } = useEnvironmentStore((store) => store);
  const { toast } = useToast();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p className="sen text-muted-foreground font-semibold mt-6 mb-4 text-center">
        {text}
      </p>
      <Button
        className="flex bg-iris-primary hover:bg-iris-primary/80 transform transition hover:scale-105"
        onClick={() => {
          setPaid(true);
          toast({
            title: "Access Granted",
            description: "You have unlocked Coxy features.",
          });
        }}
      >
        <p className="sen font-semibold text-md">Unlock Now</p>
      </Button>
    </div>
  );
}
