import { useState, type ChangeEvent, type Ref } from "react"
import { Eye, EyeOff } from "lucide-react"

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "password"
  error?: string | null
  hint?: string
  autoComplete?: string
  maxLength?: number
  ref?: Ref<HTMLInputElement>
}

function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  hint,
  autoComplete,
  maxLength,
  ref,
}: FormFieldProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === "password"
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>

      <div className="form-input-wrap">
        <input
          id={id}
          ref={ref}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required="true"
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contrasena" : "Mostrar contrasena"}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
