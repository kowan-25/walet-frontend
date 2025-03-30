"use client"

import useUser from '@/hooks/useUser'
import React from 'react'

export default function page() {

  const {username} = useUser()
  
  return (
    <div>page {username}</div>
  )
}
