
import { createRxDatabase, addRxPlugin, RxDatabase, RxDocument, RxCollection } from "rxdb"
// import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election"
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder"
import { RxDBUpdatePlugin } from "rxdb/plugins/update"
// import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb'
import { v4 as uuidv4 } from "uuid"
import { BehaviorSubject, debounce, debounceTime } from "rxjs"
import { syncCollectionFromFirestore, syncCollectionToFirestore } from "./syncFirestore"
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Article } from "./artcileType"

// Add required plugins
// addRxPlugin(RxDBReplicationCouchDBPlugin)
// addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBLeaderElectionPlugin)
addRxPlugin(RxDBQueryBuilderPlugin)

// Define schemas
const businessSchema = {
  title: "business schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
  },
  required: ["id", "name"],
}

const articleSchema = {
  title: "article schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
    qty: {
      type: "number",
      minimum: 0,
    },
    selling_price: {
      type: "number",
      minimum: 0,
    },
    business_id: {
      type: "string",
      ref: "business",
    },
  },
  required: ["id", "name", "qty", "selling_price", "business_id"],
  indexes: ["business_id"],
}


// Define the database type
// Define the types for our models
export type BusinessDocument = {
    id: string
    name: string
  }

  export type ArticleDocument = {
    id: string
    name: string
    qty: number
    selling_price: number
    business_id: string
  }

  // Define the RxDocument types
  export type BusinessDocType = RxDocument<BusinessDocument>
  export type ArticleDocType = RxDocument<ArticleDocument>

  // Define the RxCollection types
  export type BusinessCollection = RxCollection<BusinessDocument>
  export type ArticleCollection = RxCollection<ArticleDocument>

  // Define the database type
export type MyDatabase = RxDatabase<{
    businesses: BusinessCollection
    articles: ArticleCollection
  }>

  // Global connection status subject
export const connectionStatus = new BehaviorSubject<boolean>(navigator.onLine);

if (navigator.onLine) {
    connectionStatus.next(true) // Trigger initial sync manually
  }

// Handle online/offline events
if (typeof window !== "undefined") {
    window.addEventListener("online", async () => {
      connectionStatus.next(true)

      if (dbInstance) {
        try {
          await syncCollectionToFirestore(dbInstance.businesses, "businesses")
          await syncCollectionToFirestore(dbInstance.articles, "articles")
          console.log("🔥 Synced to Firestore on reconnect");
          toast.success("Synced to Firestore on reconnect", {
            position:"top-center",
          });
        } catch (err) {
          console.error("Firestore sync on reconnect failed:", err)
        }
      }
    })
  window.addEventListener("offline", () => connectionStatus.next(false))
}

let dbInstance: MyDatabase | null = null

export async function intializeDatabase(): Promise<MyDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await createRxDatabase<MyDatabase>({
    name: "businessdb",
    storage: getRxStorageDexie(),
    // ignoreDuplicate: true,
  })

  await dbInstance.addCollections({
    businesses: { schema: businessSchema },
    articles: { schema: articleSchema },
  })

dbInstance.articles.$.pipe(debounceTime(500)).subscribe(async (changeEvent) => {
    if (navigator.onLine) {
      try {
        await syncCollectionToFirestore(dbInstance?.articles, "articles")
      } catch (error) {
        console.error("Firestore sync error:", error)
      }
    }
  })

  dbInstance.businesses.$.pipe(debounceTime(500)).subscribe(async (changeEvent) => {
    if (navigator.onLine) {
      try {
        await syncCollectionToFirestore(dbInstance?.businesses, "businesses")
      } catch (error) {
        console.error("Firestore sync error:", error)
      }
    }
  })

  return dbInstance
}


// Business CRUD operations
export const createBusiness = async (name: string) => {
  const db = await intializeDatabase()
  const id = uuidv4()
  const business = {
    id,
    name,
  }
  await db.businesses.insert(business)
  return business
}

export const getBusinesses = async () => {
  const db = await intializeDatabase()
  const businesses = await db.businesses.find().exec()
  return businesses.map((doc: any) => doc.toJSON())
}

export const getBusiness = async (id: string) => {
  const db = await intializeDatabase()
  const business = await db.businesses.findOne(id).exec()
  return business ? business.toJSON() : null
}

// Article CRUD operations
export const createArticle = async (article: {
  name: string
  qty: number
  selling_price: number
  business_id: string
}) => {
  const db = await intializeDatabase()
  const id = uuidv4()
  const newArticle = {
    id,
    ...article,
  }
  await db.articles.insert(newArticle)
  return newArticle
}

export const getArticles = async (businessId?: string) => {
  const db = await intializeDatabase()
  let query = db.articles.find()

  if (businessId) {
    query = query.where("business_id").eq(businessId)
  }

  const articles = await query.exec()
  return articles.map((doc: any) => doc.toJSON())
}

export const getArticle = async (id: string) => {
  const db = await intializeDatabase()
  const article = await db.articles.findOne(id).exec()
  return article ? article.toJSON() : null
}



// Helper function to delete a business and its articles (cascade delete)
// export async function deleteBusiness(db: MyDatabase, businessId: string): Promise<void> {
//     // First, find and delete all articles associated with this business
//     const articlesToDelete = await db.articles
//       .find({
//         selector: {
//           business_id: businessId,
//         },
//       })
//       .exec()

//     // Delete each article
//     for (const article of articlesToDelete) {
//       await article.remove()
//     }

//     // Then delete the business
//     const business = await db.businesses
//       .findOne({
//         selector: {
//           id: businessId,
//         },
//       })
//       .exec()

//     if (business) {
//       await business.remove()
//     }
//   }

  // Helper function to delete an article
//   export async function deleteArticle(db: MyDatabase, articleId: string): Promise<void> {
//     const article = await db.articles
//       .findOne({
//         selector: {
//           id: articleId,
//         },
//       })
//       .exec()

//     if (article) {
//       await article.remove()
//     }
//   }


export const deleteBusiness = async (id: string) => {
    const db = await intializeDatabase();

    // Delete related articles first
    const relatedArticles = await db.articles.find().where("business_id").eq(id).exec();
    for (const article of relatedArticles) {
      await article.remove();
    }

    // Then delete the business
    const businessDoc = await db.businesses.findOne(id).where("id").eq(id).exec();
    if (businessDoc) {
      await businessDoc.remove();
      toast.success("business deleted successfully");
    }

    await syncCollectionToFirestore(db.businesses, "businesses");
  };


  export const deleteArticle = async (id: string) => {
    const db = await intializeDatabase();
    const doc = await db.articles.findOne(id).where('id').eq(id).exec();
    if (doc) {
        await doc.remove();
        toast.success("Article deleted successfully");
        // await db.articles.storageInstance.remove();
    }
    await syncCollectionToFirestore(db.articles, "articles");
  };


  export async function updateArticle(id: string, updates: Partial<Article>) {
    const db = await intializeDatabase()
    const doc = await db.articles.findOne(id).exec()

    if (!doc) throw new Error("Article not found")

    const current = doc.toMutableJSON()

    await doc.update({
      $set: {
        ...current,
        ...updates,
      },
    })
  }
