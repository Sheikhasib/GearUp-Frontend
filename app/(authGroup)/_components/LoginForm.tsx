"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignIn, Eye, EyeSlash, Horse, Storefront, ShieldStar } from "@phosphor-icons/react";
import React, { useActionState, useTransition, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, googleAuthAction, demoLoginAction } from "../_actions/authActions";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

const DEMO_ROLES = [
  { role: "CUSTOMER", label: "Customer", icon: Horse },
  { role: "PROVIDER", label: "Provider", icon: Storefront },
  { role: "ADMIN", label: "Admin", icon: ShieldStar },
] as const;

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
  const [, startGoogle] = useTransition();
  const [isDemoPending, startDemo] = useTransition();

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

  const handleDemoLogin = (role: (typeof DEMO_ROLES)[number]["role"]) => {
    startDemo(async () => {
      const stateResult = await demoLoginAction(role);
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
      </div>

      <Card className="p-5 space-y-3">
        <span className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Try a demo login
        </span>
        <div className="grid gap-2">
          {DEMO_ROLES.map((item) => (
            <Button
              key={item.role}
              variant="outline"
              className="cursor-pointer justify-start"
              onClick={() => handleDemoLogin(item.role)}
              disabled={isDemoPending}
            >
              <item.icon className="mr-1" />
              Login as {item.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;