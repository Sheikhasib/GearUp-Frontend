import React from "react";
import Link from "next/link";
import LoginForm from "../_components/LoginForm";
import { GoBackButton } from "@/components/shared/go-back-button";

export default function LoginPage() {
  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute top-6 left-1">
          <GoBackButton />
        </div>
        <div className="w-full max-w-md space-y-6 bg-card p-8 shadow-sm ring-1 ring-foreground/5">
          {/* FORM GENERIC TEXTS */}
          <div className="space-y-4 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* FORM */}
          <LoginForm></LoginForm>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}