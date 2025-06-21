'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  height?: string
  width?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${height} ${width} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

export const HeroSkeleton = () => {
  return (
    <div className="pt-32 pb-24 lg:pt-48 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <Skeleton height="h-12" width="w-3/4" className="mx-auto" />
          <Skeleton height="h-12" width="w-1/2" className="mx-auto" />
          <Skeleton height="h-6" width="w-2/3" className="mx-auto" />
          <div className="flex justify-center gap-4 mt-8">
            <Skeleton height="h-12" width="w-32" />
            <Skeleton height="h-12" width="w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ServicesSkeleton = () => {
  return (
    <div className="section-padding bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton height="h-10" width="w-48" className="mx-auto mb-4" />
          <Skeleton height="h-6" width="w-96" className="mx-auto" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="text-center space-y-4">
                <Skeleton height="h-16" width="w-16" className="mx-auto rounded-full" />
                <Skeleton height="h-6" width="w-32" className="mx-auto" />
                <Skeleton height="h-4" width="w-full" />
                <Skeleton height="h-4" width="w-5/6" />
                <Skeleton height="h-4" width="w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const AboutSkeleton = () => {
  return (
    <div className="section-padding bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton height="h-10" width="w-3/4" />
            <Skeleton height="h-4" width="w-full" />
            <Skeleton height="h-4" width="w-full" />
            <Skeleton height="h-4" width="w-5/6" />
            <Skeleton height="h-4" width="w-full" />
            <Skeleton height="h-4" width="w-4/6" />
          </div>
          <div>
            <Skeleton height="h-80" width="w-full" className="rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ContactSkeleton = () => {
  return (
    <div className="section-padding bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton height="h-10" width="w-48" className="mx-auto mb-4" />
          <Skeleton height="h-6" width="w-96" className="mx-auto" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton height="h-4" width="w-20" />
                  <Skeleton height="h-12" width="w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton height="h-4" width="w-24" />
                  <Skeleton height="h-12" width="w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton height="h-4" width="w-32" />
                <Skeleton height="h-12" width="w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton height="h-4" width="w-20" />
                <Skeleton height="h-24" width="w-full" />
              </div>
              <Skeleton height="h-12" width="w-full" />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton height="h-8" width="w-48" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton height="h-12" width="w-12" className="rounded-lg mr-4" />
                  <div className="space-y-2">
                    <Skeleton height="h-4" width="w-20" />
                    <Skeleton height="h-4" width="w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="space-y-4">
        <Skeleton height="h-8" width="w-3/4" />
        <Skeleton height="h-4" width="w-full" />
        <Skeleton height="h-4" width="w-5/6" />
        <Skeleton height="h-4" width="w-4/6" />
      </div>
    </div>
  )
}

export const TableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <Skeleton height="h-8" width="w-48" className="mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton height="h-4" width="w-1/4" />
              <Skeleton height="h-4" width="w-1/3" />
              <Skeleton height="h-4" width="w-1/4" />
              <Skeleton height="h-4" width="w-1/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Skeleton 