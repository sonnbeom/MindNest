import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const brands = [
  { name: "loops", logo: "https://assets.rapidui.dev/brands/loops.svg" },
  { name: "pwc", logo: "https://assets.rapidui.dev/brands/pwc.svg" },
  { name: "resend", logo: "https://assets.rapidui.dev/brands/resend.svg" },
  { name: "udio", logo: "https://assets.rapidui.dev/brands/udio.svg" },
  { name: "krea", logo: "https://assets.rapidui.dev/brands/krea.svg" },
  { name: "gopuff", logo: "https://assets.rapidui.dev/brands/gopuff.svg" },
];

export const BrandsGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("py-8", className)} {...props}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="max-w-xs mx-auto grid grid-cols-2 items-center md:grid-cols-3 md:max-w-lg lg:grid-cols-6 lg:max-w-3xl">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center p-4">
              <div className="relative h-[76px] w-full">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

BrandsGrid.displayName = "BrandsGrid";
