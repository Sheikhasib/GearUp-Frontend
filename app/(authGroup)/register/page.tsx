import React from "react";
import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";
import { GoBackButton } from "@/components/shared/go-back-button";

export default function RegisterPage() {
  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute top-6 left-1">
          <GoBackButton />
        </div>
        <div className="w-full max-w-md space-y-6 bg-card p-8 shadow-sm ring-1 ring-foreground/5">
          {/* FORM GENERIC TEXTS */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-gray-500">Fill in your details to get started</p>
          </div>

          {/* FORM */}
          <RegisterForm></RegisterForm>

          <p className="text-center text-sm text-gray-500">
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