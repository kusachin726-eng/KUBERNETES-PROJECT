"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  login: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") || "/dashboard",
    [searchParams],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      login: values.login,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    console.log("signIn result:", result);
    setIsLoading(false);

    if (!result || result.error) {
      setError("Invalid login or password");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium mb-1 block">Email</label>
        <Input
          type="text"
          placeholder="Email or mobile number"
          autoComplete="username"
          {...register("login", { required: "Login is required" })}
        />
         {errors.login && (
    <p className="text-xs text-red-600">
      {errors.login.message}
    </p>
  )}
      </div>

     <div className="space-y-2">
  <label className="text-sm font-medium mb-1 block">Password</label>
  <Input
    type="password"
    autoComplete="current-password"
    {...register("password", { required: "Password is required" })}
  />


  {errors.password && (
    <p className="text-xs text-red-600">
      {errors.password.message}
    </p>
  )}
</div>


      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
