import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              Dropty CRM
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to access the role-based dashboard.
            </p>
          </div>

          <Card className="p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="page-title">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-sm">Loading…</div>}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
