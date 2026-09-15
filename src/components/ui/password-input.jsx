import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function PasswordInput({
  id,
  name,
  autoComplete,
  value,
  onChange,
  onBlur,
  placeholder,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  className,
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const type = visible ? "text" : "password";
  const ToggleIcon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        className={cn(
          "rounded-lg border-border bg-secondary/50 ps-11 pe-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring",
          className
        )}
      />

      <Lock
        className="pointer-events-none absolute top-1/2 start-4 size-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("auth.hidePassword", "Hide password") : t("auth.showPassword", "Show password")}
        aria-pressed={visible}
        className="absolute top-1/2 end-3 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ToggleIcon className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}