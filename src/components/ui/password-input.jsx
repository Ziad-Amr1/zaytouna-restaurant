import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
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
          "rounded-lg border-(--color-border) bg-(--color-surface-secondary) ps-11 pe-11 text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-focus-ring)",
          className
        )}
      />

      <Lock
        className="pointer-events-none absolute top-1/2 start-4 size-5 -translate-y-1/2 text-(--color-text-secondary)"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute top-1/2 end-3 -translate-y-1/2 rounded-sm p-1 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
      >
        <ToggleIcon className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}