# Offline-First CRUD Application with RxDB and MongoDB Atlas

This project is a React.js application that demonstrates offline-first CRUD operations using RxDB for local storage and MongoDB Atlas for cloud synchronization.

## Features

- Create and manage Business entities
- Create and manage Article entities linked to Businesses
- Offline-first functionality - works without internet connection
- Automatic synchronization with MongoDB Atlas when online
- Real-time updates across the application

## Tech Stack

- React.js / Next.js (Frontend)
- RxDB (Local database)
- MongoDB Atlas (Cloud database)
- Tailwind CSS (Styling)
- shadcn/ui (UI components)

## Prerequisites

- Node.js (v16 or later)
- MongoDB Atlas account
- A MongoDB Atlas database URL

## Setup Instructions

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/rxdb-offline-crud.git
   cd rxdb-offline-crud
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory with your MongoDB Atlas URL:
   \`\`\`
   NEXT_PUBLIC_MONGODB_URL=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdatabase
   \`\`\`

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account if you don't have one.
2. Create a new cluster.
3. Create a database user with read/write permissions.
4. Add your IP address to the IP Access List.
5. Get your connection string from the "Connect" button.
6. Replace the placeholders in the connection string with your actual username and password.

## How It Works

### Offline-First Functionality

The application uses RxDB to store data locally in the browser's IndexedDB. This allows the app to function fully even when offline:

- All CRUD operations work without an internet connection
- Data is stored locally and persists between sessions
- The UI updates in real-time based on local data

### Synchronization with MongoDB Atlas

When the application is online:

1. RxDB automatically syncs local changes with MongoDB Atlas
2. Any changes made on other devices are pulled down to the local database
3. Conflicts are resolved automatically using RxDB's conflict resolution strategies

The sync process is bidirectional and happens in real-time when online, or automatically when reconnecting after being offline.

### Data Models

The application implements two main data models:

1. **Business Model**:
   - id: string (unique identifier)
   - name: string (name of the business)

2. **Article Model**:
   - id: string (unique identifier)
   - name: string (article name)
   - qty: number (quantity in stock)
   - selling_price: number (selling price)
   - business_id: string (reference to the related Business)

## Testing Offline Functionality

To test the offline functionality:

1. Open the application while online
2. Use Chrome DevTools (Network tab) to simulate offline mode
3. Create, read, update, or delete data while offline
4. Disable offline mode to see the data synchronize with MongoDB Atlas

## Troubleshooting

### Sync Issues
- Ensure your MongoDB Atlas connection string is correct
- Check that your database user has the proper permissions
- Verify your IP address is in the MongoDB Atlas IP Access List
- Check the browser console for any error messages

### Database Initialization Errors
- Clear your browser's IndexedDB storage and reload the application
- Ensure you have the latest version of the application
- Check if your browser supports IndexedDB

## Project Structure

\`\`\`
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── components/           # React components
│   ├── article-list.tsx  # List of articles
│   ├── business-list.tsx # List of businesses
│   ├── create-article.tsx # Form to create articles
│   ├── create-business.tsx # Form to create businesses
│   └── network-status.tsx # Network status indicator
├── lib/                  # Utility functions
│   └── db.ts             # Database configuration and operations
└── README.md             # Project documentation
\`\`\`

## Future Improvements

- Add update and delete operations for businesses and articles
- Implement user authentication
- Add more detailed conflict resolution strategies
- Improve offline detection and synchronization UI
- Add data validation and error handling

## License

MIT

## Acknowledgements

- [RxDB](https://rxdb.info/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

<CodeProject>
