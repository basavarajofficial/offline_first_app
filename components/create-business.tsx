"use client"

import type React from "react"

import { useState } from "react"
import { createBusiness } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"

export default function CreateBusiness() {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Validation Error",{
        description: "Business name cannot be empty",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createBusiness(name)
      setName("")
      toast.success("Business created",{
        description: "New business has been added successfully",
      })
    } catch (error) {
      console.error("Error creating business:", error)
      toast("Error",{
        description: "Failed to create business",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-y-4 w-full  mx-auto">
      <div className="flex flex-col mx-auto  gap-2 w-full md:w-[50%]">
        <Textarea
          placeholder="Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full dark:bg-slate-900 bg-slate-300 border-gray-400"
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Business"}
        </Button>
      </div>
    </form>
  )
}
