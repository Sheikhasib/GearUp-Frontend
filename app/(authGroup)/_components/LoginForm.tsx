"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignIn, Eye, EyeSlash } from "@phosphor-icons/react";
import React, { useActionState, useEffect, useState } from "react";
import { loginAction } from "../_actions/authActions";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
// import { useRouter } from 'next/navigation';

const LoginForm = () => {
  // to get the redirect url & pass it to the login action
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const registered = searchParams.get("registered") === "true";

  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo),
    { success: false, message: "" },
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (registered) {
      toast.success("Account created successfully. Please sign in.");
    }
  }, [registered]);

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Email
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="Enter Your Email"
            aria-invalid={Boolean(state?.errors?.email?.length)}
            aria-describedby={
              state?.errors?.email
                ?.map((_, i) => `login-email-error-${i}`)
                .join(" ") || undefined
            }
          />
          {state?.errors?.email?.map((e, i) => (
            <p
              key={i}
              id={`login-email-error-${i}`}
              className="mt-1 text-sm text-destructive"
            >
              {e}
            </p>
          ))}
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              aria-invalid={Boolean(state?.errors?.password?.length)}
              aria-describedby={
                state?.errors?.password
                  ?.map((_, i) => `login-password-error-${i}`)
                  .join(" ") || undefined
              }
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
          {state?.errors?.password?.map((e, i) => (
            <p
              key={i}
              id={`login-password-error-${i}`}
              className="mt-1 text-sm text-destructive"
            >
              {e}
            </p>
          ))}
        </div>
        {state?.message && !state?.success && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
        <Button className="cursor-pointer" type="submit">
          {pending ? "Submitting..." : <><SignIn className="mr-1" /> Login</>}
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
