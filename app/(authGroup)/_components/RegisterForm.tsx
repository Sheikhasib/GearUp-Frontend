"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus } from "@phosphor-icons/react";
import React, { useActionState, useEffect, useState } from "react";
import { registerAction } from "../_actions/authActions";
import { toast } from "sonner";

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, {
    success: false,
    message: "",
  });
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message || "Registration Successful");
    } else {
      toast.error(state.message || "Registration Failed");
    }
  }, [state]);

  // preview uses the pasted URL if present, otherwise the same fallback the server will generate
  const previewSrc =
    photoUrl.trim() ||
    (name
      ? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`
      : "");

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        {previewSrc && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Profile preview"
              className="h-16 w-16 rounded-full border object-cover"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="register-name"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Name
          </label>
          <Input
            id="register-name"
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="register-email"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Email
          </label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="Enter Your Email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Password
          </label>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="Enter Your Password"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Confirm Password
          </label>
          <Input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Your Password"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="register-photo"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Profile Photo URL (optional)
          </label>
          <Input
            id="register-photo"
            name="profilePhoto"
            type="text"
            placeholder="Profile Photo URL (optional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>

        <Button className="cursor-pointer" type="submit">
          {pending ? "Submitting..." : <><UserPlus className="mr-1" /> Register</>}
        </Button>
      </Card>
    </form>
  );
};

export default RegisterForm;
