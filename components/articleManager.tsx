"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { createArticle, deleteArticle, getArticles, updateArticle } from "@/lib/db"

interface Article {
  id?: string
  name: string
  qty: number
  selling_price: number
  business_id?: string
}

export default function Articles({ businessId }: { businessId: string }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Article>({
    name: "",
    qty: 0,
    selling_price: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles(businessId)
        setArticles(data)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()

    const setupSubscription = async () => {
      const db = (await import("@/lib/db")).intializeDatabase()
      ;(await db).articles
        .find()
        .where("business_id")
        .eq(businessId)
        .$.subscribe((articles: any) => {
          const articleData = articles.map((doc: any) => doc.toJSON())
          setArticles(articleData)
        })
    }

    setupSubscription()
  }, [businessId])

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
      toast.error("Article name is required")
      return
    }

    if (formData.qty < 0 || formData.selling_price < 0) {
      toast.error("Quantity and price must be non-negative")
      return
    }

    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateArticle(editingId, {
          name: formData.name,
          qty: formData.qty,
          selling_price: formData.selling_price,
        })
        toast.success("Article updated")
      } else {
        await createArticle({ ...formData, business_id: businessId })
        toast.success("Article created")
      }

      setFormData({ name: "", qty: 0, selling_price: 0 })
      setEditingId(null)
    } catch (error) {
      console.error("Error saving article:", error)
      toast.error("Failed to save article")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      name: article.name,
      qty: article.qty,
      selling_price: article.selling_price,
    })
    setEditingId(article.id || null)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id)
      toast.success("Article deleted")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete article")
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Article Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter Article Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="qty"
              placeholder="Quantity"
              value={formData.qty}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div>
            <Label>Selling Price</Label>
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
          {isSubmitting ? (editingId ? "Updating..." : "Creating...") : editingId ? "Update Article" : "Add Article"}
        </Button>
      </form>

      {/* Articles Table */}
      {loading ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="rounded-md border border-gray-300 dark:border-gray-600">
          <Table>
            <TableHeader className="border-b-2 border-b-gray-400/20">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.name}</TableCell>
                  <TableCell>{article.qty}</TableCell>
                  <TableCell>${article.selling_price.toFixed(2)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button type="button" onClick={() => handleEdit(article)}>Edit</Button>
                    <Button type="button" variant="destructive" onClick={() => handleDelete(article.id!)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
