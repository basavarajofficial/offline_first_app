"use client"

import { useState, useEffect } from "react"
import { deleteArticle, getArticles } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "./ui/button"

interface ArticleListProps {
  businessId: string
}

export default function ArticleList({ businessId }: ArticleListProps) {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


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

    // Set up subscription to changes
    const setupSubscription = async () => {
      const db = (await import("@/lib/db")).intializeDatabase();
      (await db).articles
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

  if (loading) {
    return <div>Loading articles...</div>
  }

  if (articles.length === 0) {
    return <div>No articles found for this business.</div>
  }

  return (
    <div className="rounded-md border border-gray-300 dark:border-gray-600">
      <Table >
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
              <TableCell >
                <Button onClick={async () => await deleteArticle(article.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
