"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <Alert className={`mb-6 w-fit mx-auto relative ${isOnline ? "dark:bg-gray-800 bg-slate-300" : "bg-amber-500"}`} variant="default">
        <div className="flex gap-2 items-start justify-start">
      {isOnline ?
    //   <>
    //     <span className="relative flex size-3">
    //         <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
    //         <span className="relative inline-flex size-3 rounded-full bg-green-600"></span>
    //     </span>
    //   </>
      <Wifi className="h-4 w-4 text-green-600" />
      : <WifiOff className="h-4 w-4 text-amber-800" />}
      <AlertTitle>{isOnline ? "Online Mode" : "Offline Mode"}</AlertTitle>
        </div>
      <AlertDescription>
        {!isOnline
        //   ? "You are connected to the internet. Changes will sync with firestore."
          && <>
          <p>You are currently offline.<br/> Changes will be stored locally and synced when you reconnect.</p>
          </>
            }
      </AlertDescription>
    </Alert>
  )
}
