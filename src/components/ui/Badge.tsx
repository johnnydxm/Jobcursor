import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => (
  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-800 ${className}`}>
    {children}
  </span>
)

export { Badge } 