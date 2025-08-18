import { useState, useRef } from "react";
import { X, Check } from "lucide-react";

export default function Input_01({
  label = "Label",
  placeholder = "Type something...",
  error,
  success,
  onChange,
  onClear,
  type = "text",
  className,
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    setValue("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={`w-full max-w-xs space-y-1.5 ${className}`}>
      <label className="text-sm font-medium text-zinc-300" htmlFor={label}>
        {label}
      </label>
      <div className="relative group">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800
                        text-sm text-zinc-100 placeholder:text-zinc-600 transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${
                          error
                            ? "border-red-500 focus:ring-red-500/20"
                            : success
                            ? "border-green-500 focus:ring-green-500/20"
                            : "focus:ring-indigo-500/20"
                        }
                        ${isFocused && "border-indigo-500"}`}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md 
                        text-zinc-600 hover:text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Status indicator */}
        {(error || success) && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            {error ? (
              <X className="w-4 h-4 text-red-500" />
            ) : (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Error/Success message */}
      {(error || success) && (
        <p className={`text-sm ${error ? "text-red-500" : "text-green-500"}`}>
          {error || success}
        </p>
      )}
    </div>
  );
}
