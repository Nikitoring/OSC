import React from 'react'
import './catSpinner.css'
import catImage from './assets/cat-spinner.png'

interface CatSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  speed?: 'fast' | 'normal' | 'slow'
  className?: string
}

const CatSpinner: React.FC<CatSpinnerProps> = ({
  size = 'medium',
  speed = 'normal',
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img src={catImage} alt="" className={`cat-spinner ${size} ${speed}`} />
    </div>
  )
}

export default CatSpinner
