"use client"

import type React from "react"

import { useState } from "react"
import { createArticle } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "./ui/label"

interface CreateArticleProps {
    businessId: string
}

export default function CreateArticle({ businessId }: CreateArticleProps) {
    const [formData, setFormData] = useState({
        name: "",
        qty: 0,
        selling_price: 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    //   const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "name" ? value : Number(value),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error("Validation Error", {
                description: "Article name cannot be empty",
            })
            return
        }

        if (formData.qty < 0) {
            toast.error("Validation Error", {
                description: "Quantity cannot be negative",
                // variant: "destructive",
            })
            return
        }

        if (formData.selling_price < 0) {
            toast.error("Validation Error", {
                description: "Selling price cannot be negative",
                // variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            await createArticle({
                ...formData,
                business_id: businessId,
            })

            setFormData({
                name: "",
                qty: 0,
                selling_price: 0,
            })

            toast.success("Article created", {
                description: "New article has been added successfully",
            })
        } catch (error) {
            console.error("Error creating article:", error)
            toast.error("Error", {
                description: "Failed to create article",
                // variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label>Article Name</Label>
                    <Input type="text" name="name" placeholder="Enter Article Name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <Label>Quantity</Label>
                    <Input type="number" name="qty" placeholder="Quantity" value={formData.qty} onChange={handleChange} min="0" />
                </div>
                <div>

                    <Label>Selling price</Label>
                    <Input
                        type="number"
                        name="selling_price"
                        placeholder="Selling Price"
                        value={formData.selling_price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Add Article"}
            </Button>
        </form>
    )
}
