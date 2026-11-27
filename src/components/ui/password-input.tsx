"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";

export type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type"
>;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export { PasswordInput };
