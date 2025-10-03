"use client";
import { Separator } from "@/components/ui/separator";
import UnlockNow from "@/components/unlock-now";
import { useEnvironmentStore } from "@/components/context";
import DomainChartPreview from "./domain-chart-preview";
import DomainDataPreview from "./domain-data-preview";

export default function Home() {
  const { paid } = useEnvironmentStore((store) => store);
  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
        <p className="meme-title tracking-widest font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-coxy-primary mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-12">
          Domain Intelligence Platform
        </p>
        <p className="meme-subtitle text-muted-foreground font-semibold mt-2 sm:mt-3 md:mt-4 text-center text-xs sm:text-sm md:text-base lg:text-lg max-w-4xl mx-auto px-2">
          Real-time Web3 domain analytics and market trends. <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>Discover valuable domain opportunities 🌐
        </p>
      </div>
      
      {!paid && (
        <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <UnlockNow text="View the realtime dashboard" />
        </div>
      )}
      
      {/* Domain Chart Preview */}
      <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
        <DomainChartPreview />
      </div>
      
      {/* Domain Data Preview */}
      <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
        <DomainDataPreview />
      </div>
      
      <Separator className="my-6 sm:my-8 md:my-12 lg:my-16" />
      
      {!paid && (
        <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <UnlockNow text="Unlock All Coxy features now" />
        </div>
      )}
      
      <div className="my-4 sm:my-6 md:my-8 lg:my-12" />
    </div>
  );
}
