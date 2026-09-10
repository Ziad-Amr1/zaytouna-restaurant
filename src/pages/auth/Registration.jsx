import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import useAuth from "@/hooks/useAuth";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(100, "Name must be at most 100 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, register } = useAuth();

  const redirectTarget = location.state?.from;
  const from =
    typeof redirectTarget === "string" &&
    redirectTarget.startsWith("/") &&
    !redirectTarget.startsWith("//")
      ? redirectTarget
      : "/";

  const {
    register: registerField,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to create your account right now. Please try again.";
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
            Create your account
          </h2>
          <p className="text-muted-foreground">
            Join Zaytouna Restaurant to start ordering
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
              htmlFor="register-name"
              className="block text-sm font-medium text-foreground"
            >
              Name
            </label>
            <div className="relative">
              <Input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "register-name-error" : undefined}
                {...registerField("name")}
                className="h-11 pl-11"
              />
              <User
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.name && (
              <p id="register-name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "register-email-error" : undefined}
                {...registerField("email")}
                className="h-11 pl-11"
              />
              <Mail
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.email && (
              <p id="register-email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="register-password"
                  name={field.name}
                  autoComplete="new-password"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="At least 6 characters"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "register-password-error" : undefined
                  }
                  className="h-11"
                />
              )}
            />
            {errors.password ? (
              <p
                id="register-password-error"
                className="text-sm text-destructive"
              >
                {errors.password.message}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Must be at least 6 characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="register-confirm-password"
              className="block text-sm font-medium text-foreground"
            >
              Confirm password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="register-confirm-password"
                  name={field.name}
                  autoComplete="new-password"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Repeat your password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword
                      ? "register-confirm-password-error"
                      : undefined
                  }
                  className="h-11"
                />
              )}
            />
            {errors.confirmPassword && (
              <p
                id="register-confirm-password-error"
                className="text-sm text-destructive"
              >
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Registration;