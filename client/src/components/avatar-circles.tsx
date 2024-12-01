'use client'

import React from 'react'
import { ny } from '@/lib/utils'

interface AvatarCirclesProps {
   className?: string
   numPeople?: number
   avatarUrls: string[]
}

function AvatarCircles({
   numPeople,
   className,
   avatarUrls,
}: AvatarCirclesProps) {
   return (
      <div className={ny('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
         {avatarUrls.map((url, index) => (
            <img
               key={index}
               className="size-7 rounded-full border-2 border-white dark:border-gray-800"
               src={url}
               width={24}
               height={24}
               alt={`Avatar ${index + 1}`}
            />
         ))}


          {numPeople && numPeople > 3 && (
            <a
               className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
               href=""
            >
               +{numPeople - 3}
            </a>
          )}
      </div>
   )
}

export default AvatarCircles
