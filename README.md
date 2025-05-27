# My Fork of onur.dev

This project is a fork of [onur.dev](https://github.com/onurschu/onur.dev), adapted for personal use and deployment on Vercel.

## Important Notes

### Contentful Setup

You will need to create your own Contentful space and define the necessary content models and fields. This project relies on specific Contentful structures, so ensure your setup matches the requirements.

### Environment Variables

Before running or deploying the project, you must configure the following environment variables in your `.env` file. Create a `.env` file in the root of the project if it doesn't exist.

```
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_contentful_preview_access_token
CONTENTFUL_PREVIEW_SECRET=your_contentful_preview_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_public_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anon_key
NEXT_PUBLIC_RAINDROP_ACCESS_TOKEN=your_raindrop_io_access_token (if using bookmarks feature)
NEXT_REVALIDATE_SECRET=your_nextjs_revalidation_secret
NEXT_PUBLIC_TINYBIRD_TOKEN=your_tinybird_analytics_token (if using)
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_personal_access_token (if using Airtable integration)
AIRTABLE_BASE_ID=your_airtable_base_id (if using Airtable integration)
AIRTABLE_BOOKMARKS_TABLE_ID=your_airtable_bookmarks_table_id (if using Airtable integration)
```

Replace `your_...` placeholders with your actual credentials and IDs.

## Raindrop.io Setup (Bookmarks Feature)

This project includes a bookmarks feature that integrates with [Raindrop.io](https://raindrop.io) to display your saved bookmarks. Follow these steps to set up the integration properly:

### Prerequisites

- A Raindrop.io account (free account works)
- Some bookmark collections created in your Raindrop.io account

### Step 1: Create a Raindrop.io Application

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
     - **Name**: `Personal Website` (or any name you prefer)
     - **Description**: `For personal website bookmarks display`
     - **Site**: Your website URL (e.g., `https://yourdomain.com`)
     - **Redirect URI**: Your website URL (same as above)

### Step 2: Generate Access Token

1. **Get Test Token**:
   - After creating the application, you'll see the app details page
   - In the "Credentials" section, find the "Test token" row
   - Click "Create test token" button
   - Copy the generated token (this is your access token)

> **Important**: Use the "Test token", NOT the "Client secret". The Client secret is used for OAuth flows, while the Test token is for direct API access.

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
     12345678,  // Replace with your actual collection IDs
     87654321,
     // Add more collection IDs as needed
   ]
   ```

### Step 4: Set Environment Variable

Add the access token to your `.env` file:

```
NEXT_PUBLIC_RAINDROP_ACCESS_TOKEN=your_actual_test_token_here
```

### Step 5: Restart Development Server

After updating the environment variables, restart your Next.js development server:

```bash
npm run dev
# or
bun dev
```

### Troubleshooting

- **401 Unauthorized Error**: Ensure you're using the Test token, not the Client secret
- **Empty Bookmarks**: Verify that your collection IDs in `constants.js` match your actual Raindrop.io collections
- **Network Errors**: Check if your Raindrop.io account has the collections you're trying to access

### API Rate Limits

Raindrop.io has API rate limits. The current implementation includes:
- Cache duration: 2 days for bookmark data
- Request timeout: 10 seconds
- Automatic error handling for failed requests

For more information about Raindrop.io API, visit: [https://developer.raindrop.io](https://developer.raindrop.io)

## Original README

For more information about the original project, please refer to the original [onur.dev repository](https://github.com/onurschu/onur.dev).
