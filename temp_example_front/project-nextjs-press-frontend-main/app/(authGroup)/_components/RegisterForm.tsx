"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useActionState, useEffect, useState } from "react";
import { registerAction } from "../_actions/authActions";
import { toast } from "sonner";

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, null);
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (!state) return;

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

        <Input
          name="name"
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        ></Input>
        <Input
          name="email"
          type="email"
          placeholder="Enter Your Email"
          required
        ></Input>
        <Input
          name="password"
          type="password"
          placeholder="Enter Your Password"
          required
        ></Input>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Your Password"
          required
        ></Input>
        <Input
          name="profilePhoto"
          type="text"
          placeholder="Profile Photo URL (optional)"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        ></Input>

        <Button className="cursor-pointer" type="submit">
          {pending ? "Submitting..." : "Register"}
        </Button>
      </Card>
    </form>
  );
};

export default RegisterForm;
