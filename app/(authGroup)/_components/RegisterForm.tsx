"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Eye, EyeSlash } from "@phosphor-icons/react";
import React, { useActionState, useTransition, useEffect, useState } from "react";
import { registerAction, googleAuthAction } from "../_actions/authActions";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type RegisterRole = "CUSTOMER" | "PROVIDER";

interface RegisterFormProps {
  defaultRole?: string;
}

const ROLE_OPTIONS: { value: RegisterRole; title: string; description: string }[] = [
  { value: "CUSTOMER", title: "Customer", description: "Rent gear from providers" },
  { value: "PROVIDER", title: "Provider", description: "List & rent out your gear" },
];

const RegisterForm = ({ defaultRole }: RegisterFormProps) => {
  const [state, action, pending] = useActionState(registerAction, {
    success: false,
    message: "",
  });
  const [role, setRole] = useState<RegisterRole>(
    defaultRole === "PROVIDER" ? "PROVIDER" : "CUSTOMER",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, startGoogle] = useTransition();

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message || "Registration Successful");
    } else {
      toast.error(state.message || "Registration Failed");
    }
  }, [state]);

  const fieldError = (field: string) => state?.errors?.[field]?.[0];

  const onGoogleSuccess = (res: CredentialResponse) => {
    const idToken = res.credential;
    if (!idToken) {
      toast.error("Google sign-in was cancelled. Please try again.");
      return;
    }

    startGoogle(async () => {
      const stateResult = await googleAuthAction(idToken);
      if (!stateResult.success) {
        toast.error(stateResult.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <Card className="p-5 space-y-4">
        <div className="space-y-1.5">
          <span className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            I want to
          </span>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={role === option.value}
                onClick={() => setRole(option.value)}
                className={cn(
                  "cursor-pointer rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  role === option.value
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:bg-muted",
                )}
              >
                <span className="block text-sm font-semibold">{option.title}</span>
                <span className="block text-xs">{option.description}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="role" value={role} />
          {fieldError("role") && (
            <p className="mt-1 text-sm text-destructive">{fieldError("role")}</p>
          )}
        </div>

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
            aria-invalid={Boolean(fieldError("name"))}
            aria-describedby={fieldError("name") ? "register-name-error" : undefined}
          />
          {fieldError("name") && (
            <p id="register-name-error" className="mt-1 text-sm text-destructive">
              {fieldError("name")}
            </p>
          )}
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
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "register-email-error" : undefined}
          />
          {fieldError("email") && (
            <p id="register-email-error" className="mt-1 text-sm text-destructive">
              {fieldError("email")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              aria-invalid={Boolean(fieldError("password"))}
              aria-describedby={fieldError("password") ? "register-password-error" : undefined}
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldError("password") && (
            <p id="register-password-error" className="mt-1 text-sm text-destructive">
              {fieldError("password")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Your Password"
              aria-invalid={Boolean(fieldError("confirmPassword"))}
              aria-describedby={
                fieldError("confirmPassword") ? "register-confirm-password-error" : undefined
              }
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldError("confirmPassword") && (
            <p id="register-confirm-password-error" className="mt-1 text-sm text-destructive">
              {fieldError("confirmPassword")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="register-phone"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Phone (optional)
          </label>
          <Input
            id="register-phone"
            name="phone"
            type="tel"
            placeholder="Enter Your Phone"
          />
        </div>

        {state?.message && !state?.success && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}

        <Button className="cursor-pointer" type="submit">
          {pending ? "Submitting..." : <><UserPlus className="mr-1" /> Register</>}
        </Button>
      </Card>
      </form>

      <div className="flex flex-col items-center gap-3">
        <div className="flex w-full items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>OR continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => toast.error("Google sign-in failed. Please try again.")}
          useOneTap={false}
          type="standard"
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
        />
        <p className="text-center text-xs text-muted-foreground">
          Google sign-up creates a <span className="font-medium">Customer</span> account.
          Choose Provider and sign up with email if you want to rent out gear.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
