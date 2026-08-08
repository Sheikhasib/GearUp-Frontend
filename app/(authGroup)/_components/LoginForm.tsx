"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignIn } from "@phosphor-icons/react";
import React, { useActionState, useEffect } from "react";
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
          <Input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter Your Password"
            aria-invalid={Boolean(state?.errors?.password?.length)}
            aria-describedby={
              state?.errors?.password
                ?.map((_, i) => `login-password-error-${i}`)
                .join(" ") || undefined
            }
          />
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
