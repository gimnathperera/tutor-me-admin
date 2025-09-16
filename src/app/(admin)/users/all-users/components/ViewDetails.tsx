"use client";

import { Button } from "@/components/ui/button/Button";
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useState } from "react";

interface SubjectDetailsProps {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: "admin" | "user" | "tutor";
  phoneNumber?: string;
  birthday?: string;
  status: "active" | "inactive";
  country?: string;
  city?: string;
  zip?: string;
  address?: string;
  state?: string;
  region?: string;
  tutorType?: "full-time" | "part-time" | "gov";
  gender?: "male" | "female" | "other";
  duration?: string;
  frequency?: string;
  timezone?: string;
  language?: string;
  avatar?: string;
}

export function UserDetails({
  id,
  name,
  email,
  password,
  role,
  phoneNumber,
  birthday,
  status,
  country,
  city,
  zip,
  address,
  state,
  region,
  tutorType,
  gender,
  duration,
  frequency,
  timezone,
  language,
  avatar,
}: SubjectDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>User Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>Name</Label>
            <div className={cn(displayFieldClass)}>{name}</div>
          </div>
          <div className="grid gap-3">
            <Label>Email</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {email}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Role</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {role}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Phone Number</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {phoneNumber}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Birthday</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {birthday
                ? new Date(birthday)
                    .toLocaleDateString("en-CA")
                    .replace(/-/g, "/")
                : ""}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Country</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {country}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>City</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {city}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>State</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {state}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Region</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {region}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Zip</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {zip}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Address</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {address}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Tutor Type</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {tutorType}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Gender</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {gender}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Duration</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {duration}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Frequency</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {frequency}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Time Zone</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {timezone}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Language</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {language}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Status</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {status}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Avatar</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {avatar}
              <img src={avatar} alt={"avatar Image"} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
