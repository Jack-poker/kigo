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
      data-oid="vaj93b0"
    >
      <DialogTrigger asChild data-oid="wq:rj1_">
        <Button variant="outline" data-oid="xukpvg3">
          Onboarding
        </Button>
      </DialogTrigger>
      <DialogContent
        className="gap-0 p-0 [&>button:last-child]:text-white"
        data-oid=":oc1zw:"
      >
        <div className="p-2" data-oid="i4gqivo">
          <img
            className="w-full rounded-md"
            src="/dialog-content.png"
            width={382}
            height={216}
            alt="dialog"
            data-oid="bqy7ijp"
          />
        </div>
        <div className="space-y-6 px-6 pt-3 pb-6" data-oid="siwpl3r">
          <DialogHeader data-oid="c7q_ee1">
            <DialogTitle data-oid="77o2k_w">
              {stepContent[step - 1].title}
            </DialogTitle>
            <DialogDescription data-oid="uo8bb_:">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            data-oid="2yz8gmm"
          >
            <div
              className="flex justify-center space-x-1.5 max-sm:order-1"
              data-oid="yrkqj2-"
            >
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-primary size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                  data-oid="cpr-t_m"
                />
              ))}
            </div>
            <DialogFooter data-oid="nik:ynj">
              <DialogClose asChild data-oid="dz549rl">
                <Button type="button" variant="ghost" data-oid="n:3exkn">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                  data-oid="2c_dx3m"
                >
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                    data-oid="d7ttpmx"
                  />
                </Button>
              ) : (
                <DialogClose asChild data-oid="wh9sdcy">
                  <Button type="button" data-oid="0rwu8:u">
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
