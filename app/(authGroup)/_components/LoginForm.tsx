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

  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo),
    { success: false, message: "" },
  );
  // const router = useRouter();

  console.log(state);

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
        <div>
          <Input name="email" type="email" placeholder="Enter Your Email" />
          {state?.errors?.email?.map((e, i) => (
            <p key={i} className="mt-1 text-sm text-red-500">{e}</p>
          ))}
        </div>
        <div>
          <Input name="password" type="password" placeholder="Enter Your Password" />
          {state?.errors?.password?.map((e, i) => (
            <p key={i} className="mt-1 text-sm text-red-500">{e}</p>
          ))}
        </div>
        {state?.message && !state?.success && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <Button className="cursor-pointer" type="submit">
          {pending ? "Submitting..." : <><SignIn className="mr-1" /> Login</>}
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;