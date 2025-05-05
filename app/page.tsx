"use client"

import { useEffect, useState } from "react"
// import { initDatabase } from "@/lib/db"
import BusinessList from "@/components/business-list"
import CreateBusiness from "@/components/create-business"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { NetworkStatus } from "@/components/network-status"
import { intializeDatabase } from "@/lib/db"
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton"

export default function Home() {
  const [dbInitialized, setDbInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const setupDb = async () => {
      try {
        await intializeDatabase()
        setDbInitialized(true)
        toast({
          title: "Database initialized",
          description: "Local database is ready to use",
        })
      } catch (error) {
        console.error("Failed to initialize database:", error)
        toast({
          title: "Database initialization failed",
          description: "Check console for details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    setupDb()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Initializing database...</h2>
          <p className="text-muted-foreground">Please wait while we set up your local database</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 sm:max-w-[80%] w-full">
        <div className="flex items-center justify-between">
            <h1 className="mb-8 text-2xl font-bold truncate">Offline-First CRUD Application</h1>
            <ThemeToggleButton />
        </div>

        <NetworkStatus />

      <div className="w-full mb-8 flex flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-semibold">Create New Business</h2>
        <CreateBusiness />
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold mx-auto">Businesses</h2>
        {dbInitialized ? <BusinessList /> : <p>Database not initialized. Please refresh the page.</p>}
      </div>

      <Toaster />
    </main>
  )
}
