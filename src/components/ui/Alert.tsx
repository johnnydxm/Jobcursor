import React from 'react'

interface AlertProps {
  children: React.ReactNode
  className?: string
}

const Alert: React.FC<AlertProps> = ({ children, className = '' }) => (
  <div className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 ${className}`}>
    {children}
  </div>
)

interface AlertDescriptionProps {
  children: React.ReactNode
  className?: string
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '' }) => (
  <div className={`mt-2 text-sm ${className}`}>
    {children}
  </div>
)

export { Alert, AlertDescription }
