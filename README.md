# Rec-er

A terminal-style blog manager built with Next.js, featuring a unique command-line interface for browsing and managing blog posts.

## Features

- 🖥️ Terminal-style command interface
- 📝 Markdown blog rendering with CodePen embeds
- 🔐 Firebase authentication
- 💬 Blog conversations/comments system
- 🎨 Customizable terminal colors
- 📱 Responsive design
- 🔍 Search functionality by title and tags

## Tech Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **UI**: React 19.2.3
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: AWS S3
- **Styling**: CSS with custom terminal theme

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase project credentials
- AWS S3 bucket for blog content

### Installation

1. Clone the repository:
```bash
git clone https://github.com/trishantpahwa/rec-er.git
cd rec-er
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase credentials:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

The terminal interface supports the following commands:

- `help` - Display all available commands
- `ls [-T] [-t] [-a]` - List all blogs (with optional flags for Title, DateTime, Access)
- `open <blogID>` - Open a specific blog post
- `search <keyword>` - Search blogs by title or tags
- `login` - Authenticate with Google
- `logout` - Sign out
- `converse -b <blogID> -c <message>` - Add a comment to a blog
- `converse -b <blogID> -v` - View conversations for a blog
- `share .` - Share the current page
- `color <color>` - Change terminal text color
- `background-color <color>` - Change terminal background color
- `clear` - Clear the terminal screen
- `exit` - Close the terminal window

## Project Structure

```
rec-er/
├── app/                    # Next.js App Router pages
│   ├── layout.js          # Root layout with global styles
│   ├── page.js            # Home page (terminal interface)
│   ├── globals.css        # Global styles
│   └── blog/[id]/         # Dynamic blog routes
│       └── page.js        # Blog post page
├── src/
│   ├── config/            # Configuration files
│   │   └── firebase.config.js
│   └── services/          # Business logic and API calls
│       ├── firebase/      # Firebase services
│       ├── aws/           # AWS S3 services
│       ├── blogs.service.js
│       ├── users.service.js
│       └── conversations.service.js
├── public/                # Static assets
└── next.config.js         # Next.js configuration
```

## Building for Production

```bash
npm run build
npm start
```

## Migration Notes

This project was recently migrated from Create React App to Next.js with the following changes:
- Removed Redux state management in favor of local component state
- Converted to Next.js App Router for better performance
- Implemented proper client/server component separation
- Moved Firebase credentials to environment variables for security

## Browse by tags, calendar search name

Create search blog action, reducer, constants, and service.

Commands:

-   share: Share the blog.

Add only to read from meta folder in search lambda, from the bucket wrec-er.
