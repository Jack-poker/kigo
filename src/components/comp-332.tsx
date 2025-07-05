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
      data-oid="tcb_l2u"
    >
      <DialogTrigger asChild data-oid="5arnjsx">
        <Button variant="outline" data-oid=".kl6jn7">
          Onboarding
        </Button>
      </DialogTrigger>
      <DialogContent
        className="gap-0 p-0 [&>button:last-child]:text-white"
        data-oid="8crw.zm"
      >
        <div className="p-2" data-oid="i2_ywh9">
          <img
            className="w-full rounded-md"
            src="/dialog-content.png"
            width={382}
            height={216}
            alt="dialog"
            data-oid="7293jg2"
          />
        </div>
        <div className="space-y-6 px-6 pt-3 pb-6" data-oid=".lvakr9">
          <DialogHeader data-oid="81lbeg4">
            <DialogTitle data-oid="od1b5o1">
              {stepContent[step - 1].title}
            </DialogTitle>
            <DialogDescription data-oid="u4_8t15">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            data-oid="p2r_zi7"
          >
            <div
              className="flex justify-center space-x-1.5 max-sm:order-1"
              data-oid="r9g6g2a"
            >
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-primary size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                  data-oid="i5k3-4o"
                />
              ))}
            </div>
            <DialogFooter data-oid="o90-z2_">
              <DialogClose asChild data-oid="69x1k--">
                <Button type="button" variant="ghost" data-oid="56zk3qs">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                  data-oid="6p.qzov"
                >
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                    data-oid="sv0whl3"
                  />
                </Button>
              ) : (
                <DialogClose asChild data-oid="gwr9zm4">
                  <Button type="button" data-oid="n1wlwma">
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
