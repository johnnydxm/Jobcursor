import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
}

const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => (
  <label className={`block font-medium mb-1 text-gray-900 ${className}`} {...props}>
    {children}
  </label>
)

export { Label }
