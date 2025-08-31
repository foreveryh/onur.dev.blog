# My Fork of onur.dev

**English** | [**简体中文**](./README_ZH.md)

This project is a fork of [onur.dev](https://github.com/onurschu/onur.dev), adapted for personal use and deployment on
Vercel.

## 🚀 Recent Updates

### June 2025
- ✅ **Implemented Global Error Boundary**: Added a project-wide error boundary to gracefully handle rendering errors and improve application stability.
- ✅ **Added Vercel Analytics Integration**: Built-in website analytics with zero configuration
- 🔧 **Fixed Environment Variable Configuration**: Resolved Musings production deployment issues
- 📊 **Improved Data Synchronization**: Enhanced ISR cache management

## 📖 Documentation

### 🚨 [**Contentful Complete Usage Guide**](./docs/CONTENTFUL_GUIDE.md) 🚨

**Essential reading**: This comprehensive guide covers everything you need to know about using Contentful with this
project, including:

- Content model setup and field configuration
- Blog writing workflow and best practices
- Webhook automation for automatic deployments
- Multi-layer caching mechanisms
- SEO optimization strategies
- Troubleshooting common issues

**Start here before setting up your Contentful space.**

### 🎨 [**Visual Explorer Module**](./docs/VISUAL_EXPLORER_README.md) 🎨

**Visual content showcase**: A comprehensive guide for the Visual Explorer module featuring:

- Sora-inspired waterfall layout with Cloudinary integration
- Automatic image optimization and video thumbnail generation
- EXIF metadata extraction and display
- Complete setup and deployment instructions
- Real-time media management and responsive design

**Fully deployed and production-ready visual portfolio system.**

### 💭 [**Musings System**](./docs/MUSINGS_README.md) 💭

**GitHub Issues as CMS**: An innovative microblogging platform that uses GitHub Issues as a backend:

- Serverless content management with GitHub Issues
- Next.js ISR with 24-hour cache revalidation
- Tag-based filtering and modern card design
- Verification code authentication system
- Complete technical documentation and setup guide

**Lightweight, scalable solution for personal thoughts and reflections.**

## Important Notes

### Contentful Setup

You will need to create your own Contentful space and define the necessary content models and fields. This project
relies on specific Contentful structures, so ensure your setup matches the requirements outlined in the
[Contentful Usage Guide](./docs/CONTENTFUL_GUIDE.md).

### Environment Variables

Before running or deploying the project, you must configure the following environment variables in your `.env` file.
Create a `.env` file in the root of the project if it doesn't exist.

# Site Configuration (Required for Open Graph images)

NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.com

# Contentful CMS Configuration

CONTENTFUL_SPACE_ID=your_contentful_space_id CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_contentful_preview_access_token
CONTENTFUL_PREVIEW_SECRET=your_contentful_preview_secret

# Supabase Database Configuration

SUPABASE_URL=your_supabase_project_url SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_public_project_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anon_key

# Cloudinary Media Storage (Required for Visual Explorer)

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Musings Module Configuration (碎碎念)

MUSING_CODE=your_secret_validation_code GITHUB_PAT=ghp_your_github_personal_access_token

# Optional Integrations

# Analytics & Monitoring
NEXT_PUBLIC_TINYBIRD_TOKEN=your_tinybird_analytics_token # Optional: additional analytics

# Raindrop.io OAuth Integration (for Bookmarks)
RAINDROP_CLIENT_ID=your_raindrop_oauth_client_id
RAINDROP_CLIENT_SECRET=your_raindrop_oauth_client_secret
RAINDROP_ENCRYPTION_KEY=your_32_character_encryption_key
RAINDROP_ENCRYPTED_REFRESH_TOKEN=generated_after_oauth_completion

# Revalidation & Cache Management
NEXT_REVALIDATE_SECRET=your_nextjs_revalidation_secret

# Airtable Integration (if using Airtable for data storage)
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_BOOKMARKS_TABLE_ID=your_airtable_bookmarks_table_id

Replace `your_...` placeholders with your actual credentials and IDs.

**Important for Twitter/Social Media Sharing**: Make sure to set `NEXT_PUBLIC_SITE_URL` to your actual deployed domain
(e.g., `https://yourdomain.vercel.app`) for Open Graph images to work correctly on social platforms.

#### Cloudinary Setup for Visual Explorer

The Visual Explorer module requires Cloudinary for media storage and optimization. To set it up:

1. **Create a Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Get Your Credentials**: Find them in your Cloudinary dashboard
   - **Cloud Name**: Found in your dashboard URL and settings
   - **API Key**: Your unique API identifier
   - **API Secret**: Your secret authentication key
3. **Create Visual Folder**: In Cloudinary, create a folder named `visual` for your media files
4. **Upload Content**: Drag and drop images/videos into the `visual` folder
5. **Add Metadata**: Use Cloudinary's context fields to add titles, descriptions, and other metadata

The Visual Explorer will automatically display all media from your `visual` folder with optimized delivery and
responsive sizing.

## Musings System Setup

The Musings system allows you to publish short thoughts and notes directly from your blog to a GitHub repository, where
they are stored as Issues and displayed on your website. **For complete technical documentation, see [Musings Documentation](./docs/MUSINGS_README.md)**.

### Prerequisites

- A public GitHub repository for storing your musings (e.g., `foreveryh/git-thoughts`)
- A GitHub Personal Access Token with `public_repo` permissions
- A GitHub Action in your thoughts repository that generates `public/issues.json`

### Step 1: GitHub Repository Setup

1. **Create a GitHub Repository**:

   - Create a new public repository (e.g., `git-thoughts`)
   - This will store your musings as GitHub Issues

2. **Set up GitHub Action**:
   - Create `.github/workflows/update-issues.yml` in your thoughts repository
   - Configure it to generate `public/issues.json` when issues are created/updated
   - The JSON should be available at: `https://raw.githubusercontent.com/username/git-thoughts/main/public/issues.json`

### Step 2: GitHub Personal Access Token

1. **Generate Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token"
   - Select scopes: `public_repo`
   - Copy the generated token

### Step 3: Configure Environment Variables

Add these to your `.env` file:

```bash
# Secret code that must be included in posts for validation
MUSING_CODE=your_secret_validation_code

# GitHub Personal Access Token with public_repo permissions
GITHUB_PAT=ghp_your_github_personal_access_token
```

### Step 4: Usage

1. **Viewing Musings**: Navigate to `/musings` on your website
2. **Publishing**: Click "New Musing" to open the quick-post dialog
3. **Content**: Write your thoughts and include the secret validation code
4. **Publishing**: The content will be posted as a GitHub Issue and appear on your site

### Features

- **ISR Caching**: Pages are statically generated and revalidated every 24 hours
- **Tag Filtering**: Filter musings by tags (Daily, Idea, Work, Life, etc.)
- **Markdown Support**: Full markdown rendering with line breaks and formatting
- **Security**: Secret code validation prevents unauthorized posting
- **Modern UI**: Elegant card design with gradient hover effects
- **Mobile Friendly**: Responsive design works on all devices
- **Smart Titles**: Auto-generated titles from content with intelligent truncation

### Data Synchronization

- GitHub repository updates at 2 AM France time daily
- Website data updates at 3 AM France time daily via ISR
- Manual revalidation available through posting new musings

## Musings ISR Cache Issue Resolution

If you've published new GitHub Issues but the blog doesn't show the latest content, this is due to the Next.js ISR caching mechanism.

### Solutions:

1. **Use the revalidation script** (recommended):
   ```bash
   # Revalidate production environment
   ./scripts/revalidate-musings.sh
   
   # Revalidate local development environment
   ./scripts/revalidate-musings.sh "http://localhost:3000"
   ```

2. **Manual API call**:
   ```bash
   # POST request to revalidation endpoint
   curl -X POST "https://me.deeptoai.com/api/revalidate?path=/musings"
   ```

3. **Wait for automatic update**:
   - ISR cache will automatically expire after 24 hours
   - The first visitor will trigger page regeneration

## Raindrop.io OAuth Setup (Bookmarks Feature)

This project includes a bookmarks feature that integrates with [Raindrop.io](https://raindrop.io) using OAuth 2.0 authentication to securely access your saved bookmarks. The system supports multiple token storage strategies and automatic token refresh.

### Prerequisites

- A Raindrop.io account (free account works)
- Some bookmark collections created in your Raindrop.io account

### Step 1: Create a Raindrop.io OAuth Application

1. **Login to Raindrop.io**:
   - Go to [https://raindrop.io](https://raindrop.io)
   - Sign in to your account

2. **Access Developer Settings**:
   - Click on your profile avatar in the top-right corner
   - Select "Settings"
   - In the left sidebar, find and click "Integrations"
   - Click on "For developers"

3. **Create New Application**:
   - Click "Create new app"
   - Fill in the application details:
     - **Name**: `Personal Website OAuth` (or any name you prefer)
     - **Description**: `OAuth integration for personal website bookmarks`
     - **Site**: Your website URL (e.g., `https://yourdomain.com`)
     - **Redirect URI**: `https://yourdomain.com/api/auth/raindrop/callback` ⚠️ **Critical: Must be exact**

### Step 2: Configure Environment Variables

Add the following variables to your Vercel project settings or `.env` file:

```bash
# Raindrop.io OAuth Credentials
RAINDROP_CLIENT_ID=your_client_id_from_raindrop_app
RAINDROP_CLIENT_SECRET=your_client_secret_from_raindrop_app

# Encryption Key for Token Storage (32 characters)
RAINDROP_ENCRYPTION_KEY=generate_a_32_character_random_string

# Base URL for OAuth Callbacks
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Encrypted Tokens (Set after OAuth completion - see Step 4)
RAINDROP_ENCRYPTED_REFRESH_TOKEN=will_be_generated_during_oauth_setup
```

### Step 3: Configure Collection IDs

1. **Find Your Collection IDs**:
   - In Raindrop.io, go to your collections
   - The collection ID can be found in the URL when viewing a collection
   - For example, in `https://app.raindrop.io/my/12345678`, the ID is `12345678`

2. **Update Constants File**:
   - Open `src/lib/constants.js`
   - Update the `COLLECTION_IDS` array with your actual collection IDs:
   ```javascript
   export const COLLECTION_IDS = [
     12345678, // Replace with your actual collection IDs
     87654321  // Add more collection IDs as needed
   ]
   ```

### Step 4: Complete OAuth Setup

1. **Access OAuth Setup Page**:
   - Navigate to `/admin/raindrop-setup` on your website
   - You should see the OAuth setup interface

2. **Start OAuth Flow**:
   - Click "开始 OAuth 认证" (Start OAuth Authentication)
   - You'll be redirected to Raindrop.io for authorization
   - Click "Agree" to authorize your application

3. **Copy Encrypted Token**:
   - After successful authorization, check your Vercel function logs
   - Look for a message like:
   ```
   🔐 Encrypted token (add this to RAINDROP_ENCRYPTED_REFRESH_TOKEN env var):
   [long encrypted string]
   ```
   - Copy this encrypted string

4. **Set Final Environment Variable**:
   - In Vercel project settings, add/update:
   - `RAINDROP_ENCRYPTED_REFRESH_TOKEN=[paste the encrypted string here]`
   - Redeploy or wait for automatic deployment

5. **Verify Setup**:
   - Return to `/admin/raindrop-setup`
   - Status should now show "已认证" (Authenticated)
   - Visit `/bookmarks` to see your bookmark collections

### Token Storage Strategies

The system automatically selects the best available storage method:

1. **Vercel KV** (if `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set)
2. **Supabase** (if `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_ANON_KEY` are set)  
3. **Environment Variables** (fallback - requires manual encrypted token setup)

### Features

- **Automatic Token Refresh**: Access tokens are automatically refreshed when needed
- **Secure Storage**: All tokens are encrypted before storage
- **Build-time Safe**: Gracefully handles missing authentication during static generation
- **Multiple Storage Options**: Supports different deployment environments
- **Admin Interface**: Web-based setup and status monitoring

### Troubleshooting

- **"未认证" Status**: Complete the OAuth flow and set the encrypted token environment variable
- **Build Failures**: Ensure all environment variables are set correctly
- **Empty Bookmarks**: Verify collection IDs in `constants.js` match your Raindrop.io collections
- **OAuth Errors**: Check that redirect URI exactly matches your application settings

### API Information

- **Token Lifetime**: Access tokens expire after 2 weeks, automatically refreshed
- **Cache Duration**: Bookmark data is cached for 2 days
- **Rate Limits**: Automatic handling with appropriate timeouts

## Analytics & Monitoring

### Vercel Analytics

Built-in website analytics with zero configuration. Access your metrics in the Vercel Dashboard → Analytics tab after deployment.

## Original README

For more information about the original project, please refer to the original
[onur.dev repository](https://github.com/onurschu/onur.dev).
