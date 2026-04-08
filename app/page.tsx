"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { LandingPage } from "@/components/landing/landing-page"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return <LandingPage />
}
