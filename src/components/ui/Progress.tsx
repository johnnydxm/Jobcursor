import React from 'react'

interface ProgressProps {
  value: number
  max?: number
  className?: string
}

const Progress: React.FC<ProgressProps> = ({ value, max = 100, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
)

export { Progress } 