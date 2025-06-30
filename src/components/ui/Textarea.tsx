import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = '', ...props }, ref) => (
  <textarea ref={ref} className={`border px-3 py-2 rounded w-full text-gray-900 ${className}`} {...props} />
))

Textarea.displayName = 'Textarea'

export { Textarea }
