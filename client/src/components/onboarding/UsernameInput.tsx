import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkUsernameThrottled } from "@/sdk/auth/username";
import React from "react";

type Status = 'idle' | 'checking' | 'available' | 'error' | 'warning';

interface UsernameInputProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value: string;
  minLength?: number;
  prefixAt?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onStatusChange?: (status: Status, message?: string) => void;
}

export function UsernameInput({
  id = "username",
  name = "username",
  label = "Username",
  placeholder = "yourname",
  value,
  minLength = 3,
  prefixAt = true,
  className = "",
  onChange,
  onStatusChange,
}: UsernameInputProps) {
  const [status, setStatus] = React.useState<Status>('idle');
  const [message, setMessage] = React.useState<string | undefined>(undefined);
  const currentRef = React.useRef("");

  function updateStatus(next: Status, msg?: string) {
    setStatus(next);
    setMessage(msg);
    onStatusChange?.(next, msg);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    onChange(raw);
    const val = (raw || "").trim().toLowerCase();
    currentRef.current = val;
    updateStatus('idle', undefined);
    if (val.length < minLength) {
      updateStatus('warning', `At least ${minLength} characters required`);
      return;
    }
    updateStatus('checking');
    try {
      const { available } = await checkUsernameThrottled(val);
      if (currentRef.current !== val) return; // stale
      if (!available) {
        updateStatus('error', 'Username is already taken');
      } else {
        updateStatus('available', 'Username available');
      }
    } catch (err) {
      if (currentRef.current !== val) return;
      updateStatus('warning', 'Could not validate username. Please try again.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {status === 'checking' && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
            Checking
          </span>
        )}
      </div>
      <div className="flex mt-1 relative w-full">
        {prefixAt && (
          <div className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300">
            <span className="text-gray-500">@</span>
          </div>
        )}
        <Input
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          className={`rounded-l-none pr-9 ${status==='available' ? 'ring-2 ring-green-500 ring-offset-2' : ''} ${status==='error' ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${status==='warning' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''} ${className}`}
          placeholder={placeholder}
        />
        {status === 'available' && (
          <span className="material-icons text-green-500 absolute right-2 top-1/2 -translate-y-1/2 text-base">check_circle</span>
        )}
      </div>
      {status === 'available' && message && (
        <p className="text-xs text-green-600 mt-1">{message}</p>
      )}
      {status === 'warning' && message && (
        <p className="text-xs text-yellow-600 mt-1">{message}</p>
      )}
      {status === 'error' && message && (
        <p className="text-xs text-red-600 mt-1">{message}</p>
      )}
    </div>
  );
}

