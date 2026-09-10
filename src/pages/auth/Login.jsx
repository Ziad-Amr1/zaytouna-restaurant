import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import useAuth from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const redirectTarget = location.state?.from;
  const from =
    typeof redirectTarget === "string" &&
    redirectTarget.startsWith("/") &&
    !redirectTarget.startsWith("//")
      ? redirectTarget
      : "/";

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to sign in right now. Please try again.";
      setError("root", { message });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in
          </h2>
          <p className="text-muted-foreground">
            Welcome back to Zaytouna Restaurant
          </p>
        </div>

        {errors.root && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
                className="h-11 pl-11"
              />
              <Mail
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.email && (
              <p id="login-email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="login-password"
                  name={field.name}
                  autoComplete="current-password"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "login-password-error" : undefined
                  }
                  className="h-11"
                />
              )}
            />
            {errors.password && (
              <p id="login-password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting && (
              <Loader2 className="animate-spin" aria-hidden="true" />
            )}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;