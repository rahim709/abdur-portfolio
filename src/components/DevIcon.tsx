"use client"

import Image from "next/image"
import { useState } from "react"
import { FiCpu } from "react-icons/fi"
import { cn } from "@/lib/utils"

interface DevIconProps {
  name: string
  text?: string
  className?: string
  iconClassName?: string
}

export default function DevIcon({ name, text, className, iconClassName }: DevIconProps) {
  const [imgError, setImgError] = useState(false)

  // If the image failed to load, show the CPU icon instead (with same sizing classes)
  if (imgError) {
    if (text) {
      return (
        <div className={cn("flex items-center space-x-2", className)}>
          <FiCpu className={cn("size-6", iconClassName)} />
          <span className="font-semibold text-lg">{text}</span>
        </div>
      )
    }

    return <FiCpu className={cn("size-6", iconClassName, className)} />
  }

  // Attempt to load the image from the public/dev folder. If it errors, onError will set imgError.
  if (text) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Image
          src={`/dev/${name}.svg`}
          alt={`${name} icon`}
          width={24}
          height={24}
          className={cn("h-6 w-6", iconClassName)}
          onError={() => setImgError(true)}
        />
        <span className="font-semibold text-lg">{text}</span>
      </div>
    )
  } else {
    return (
      <Image
        src={`/dev/${name}.svg`}
        alt={`${name} icon`}
        width={24}
        height={24}
        className={cn("h-6 w-6", iconClassName, className)}
        onError={() => setImgError(true)}
      />
    )
  }
}
