"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useActionState, useEffect } from "react";
import { loginAction } from "../_actions/authActions";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
// import { useRouter } from 'next/navigation';

const LoginForm = () => {
  // to get the redirect url & pass it to the login action
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";

  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo), // bind the redirect url to the login action
    false,
  );
  // const router = useRouter();

  console.log(state);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Login Successfull");
      // router.push("/dashboard");
    }

    if (!state.success) {
      toast.error(state.message || "Login Failed");
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        <Input name="email" type="email" placeholder="Enter Your Email"></Input>
        <Input
          name="password"
          type="password"
          placeholder="Enter Your Password"
        ></Input>
        <Button className="cursor-pointer" type="submit">
          {pending ? "Submitting..." : "Login"}
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
