import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => (
  <input ref={ref} className={`border px-3 py-2 rounded w-full text-gray-900 ${className}`} {...props} />
))

Input.displayName = 'Input'

export { Input }
