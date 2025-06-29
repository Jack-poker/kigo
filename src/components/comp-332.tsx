import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Component() {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      title: "Welcome to Origin UI",
      description:
        "Discover a powerful collection of components designed to enhance your development workflow.",
    },
    {
      title: "Customizable Components",
      description:
        "Each component is fully customizable and built with modern web standards in mind.",
    },
    {
      title: "Ready to Start?",
      description:
        "Begin building amazing interfaces with our comprehensive component library.",
    },
    {
      title: "Get Support",
      description:
        "Access our extensive documentation and community resources to make the most of Origin UI.",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
      data-oid="4xxu98o"
    >
      <DialogTrigger asChild data-oid="opyle8c">
        <Button variant="outline" data-oid="e_di3sc">
          Onboarding
        </Button>
      </DialogTrigger>
      <DialogContent
        className="gap-0 p-0 [&>button:last-child]:text-white"
        data-oid="28iwq4c"
      >
        <div className="p-2" data-oid="lk-:n-f">
          <img
            className="w-full rounded-md"
            src="/dialog-content.png"
            width={382}
            height={216}
            alt="dialog"
            data-oid="zby7rf:"
          />
        </div>
        <div className="space-y-6 px-6 pt-3 pb-6" data-oid="hkqtguf">
          <DialogHeader data-oid="chnueh7">
            <DialogTitle data-oid="-q2g07a">
              {stepContent[step - 1].title}
            </DialogTitle>
            <DialogDescription data-oid="3glkico">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            data-oid="tuj30t6"
          >
            <div
              className="flex justify-center space-x-1.5 max-sm:order-1"
              data-oid="2ls.7-_"
            >
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-primary size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                  data-oid="s1g_e:0"
                />
              ))}
            </div>
            <DialogFooter data-oid="w-.h-x_">
              <DialogClose asChild data-oid="b33tzcd">
                <Button type="button" variant="ghost" data-oid="rcsx0by">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                  data-oid="nxacovl"
                >
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                    data-oid="89xqkjg"
                  />
                </Button>
              ) : (
                <DialogClose asChild data-oid="v0zuizm">
                  <Button type="button" data-oid="jlv.exs">
                    Okay
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
