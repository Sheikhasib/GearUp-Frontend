import React from "react";
import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";
import { GoBackButton } from "@/components/shared/go-back-button";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const defaultRole = typeof sp.role === "string" ? sp.role : undefined

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute top-6 left-1">
          <GoBackButton />
        </div>
        <div className="w-full max-w-md space-y-6 bg-card p-8 shadow-sm ring-1 ring-foreground/5">
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              Create an Account
            </h1>
            <p className="text-muted-foreground">Fill in your details to get started</p>
          </div>

          <RegisterForm defaultRole={defaultRole} />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}