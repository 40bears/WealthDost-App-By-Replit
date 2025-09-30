import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function PasswordInput({ id, name, label, placeholder, value, error, onChange }: PasswordInputProps) {
  const [show, setShow] = React.useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function toggleShow() {
    setShow((s) => !s);
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={handleChange}
          className="pr-9"
          placeholder={placeholder}
          autoComplete={name === 'password' ? 'new-password' : 'off'}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

