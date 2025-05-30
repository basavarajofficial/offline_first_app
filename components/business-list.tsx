"use client"

import { useState, useEffect } from "react"
import { deleteBusiness, getBusinesses } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import ArticleList from "@/components/article-list"
import CreateArticle from "@/components/articleManager"
import ArticleManager from "@/components/articleManager"

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);

  const [editingBusiness, setEditingBusiness] = useState<{ id: string, name: string } | null>(null)
    const [editName, setEditName] = useState("")


  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getBusinesses()
        setBusinesses(data)
      } catch (error) {
        console.error("Error fetching businesses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()

    // Set up subscription to changes
    const setupSubscription = async () => {
      const db = (await import("@/lib/db")).intializeDatabase();
      (await db).businesses.find().$.subscribe((businesses: any) => {
        const businessData = businesses.map((doc: any) => doc.toJSON())
        setBusinesses(businessData)
      })
    }
    setupSubscription()
  }, [])

  const toggleExpand = (businessId: string) => {
    if (expandedBusiness === businessId) {
      setExpandedBusiness(null)
    } else {
      setExpandedBusiness(businessId)
    }
  }


  if (loading) {
    return (
        <div className="flex justify-center p-6">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
  }

  if (businesses.length === 0) {
    return (
        <div className="border border-gray-300 shadow-sm dark:border-gray-600 rounded-lg p-6 text-center bg-gray-200 dark:bg-slate-900">
            <p className="text-gray-500">No businesses found. Create one to get started.</p>
        </div>
    )
  }

  return (
    <div className="space-y-4 ">
      {businesses.map((business) => (
        <Card key={business.id} className="overflow-hidden bg-gray-200 dark:bg-slate-900">
          <CardHeader className="pb-2 flex">
              <CardTitle className="text-base md:text-lg font-normal ">{business.name}</CardTitle>
            <div className="flex items-center justify-end gap-2">
            <Button size="sm" onClick={() => {
                setEditingBusiness({ id: business.id, name: business.name })
                setEditName(business.name)
                }}>
                Edit
            </Button>
              <Button color="danger" variant="destructive" size="sm" onClick={() => deleteBusiness(business.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => toggleExpand(business.id)}>
                {expandedBusiness === business.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedBusiness === business.id && (
            <CardContent>
                          {editingBusiness?.id === business.id && (
  <form
    onSubmit={async (e) => {
      e.preventDefault()
      const db = await (await import("@/lib/db")).intializeDatabase()
      const doc = await db.businesses.findOne({ selector: { id: editingBusiness?.id}}).exec();
      if (doc) {
        await doc.update({ $set: { name: editName } })
        setEditingBusiness(null)
      }
    }}
    className="mb-4 space-y-2"
  >
    <input
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      className="w-full p-2 rounded border border-gray-300"
    />
    <div className="flex gap-2">
      <Button type="submit">Save</Button>
      <Button variant="ghost" onClick={() => setEditingBusiness(null)}>Cancel</Button>
    </div>
  </form>
            )}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Add New Article</h3>
                {/* <CreateArticle businessId={business.id} /> */}
                <ArticleManager businessId={business.id} />
              </div>
              {/* <div>
                <ArticleList businessId={business.id} />
              </div> */}
            </CardContent>
          )}

        </Card>
      ))}
    </div>
  )
}
