# Contentful Usage Guide

This comprehensive guide explains how to set up and use Contentful CMS for this blog project, including content
modeling, writing workflow, webhook automation, and caching mechanisms.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Content Models Configuration](#content-models-configuration)
3. [Content Creation Workflow](#content-creation-workflow)
4. [Webhook Automation](#webhook-automation)
5. [Caching Mechanisms](#caching-mechanisms)
6. [SEO Optimization](#seo-optimization)
7. [Troubleshooting](#troubleshooting)

## Initial Setup

### 1. Create Contentful Space

1. **Sign up/Login** to [Contentful](https://www.contentful.com)
2. **Create a new space** for your blog
3. **Note your Space ID** from the space settings
4. **Generate API keys** in Settings > API keys:
   - Content Delivery API access token
   - Content Preview API access token
   - Content Management API access token (for webhooks)

### 2. Environment Variables

Add these to your `.env` file:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_api_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
NEXT_REVALIDATE_SECRET=your_revalidation_secret
```

## Content Models Configuration

### 1. SEO Content Model

**Content Type ID**: `seo`

| Field Name        | Field ID          | Type             | Validation              |
| ----------------- | ----------------- | ---------------- | ----------------------- |
| Title             | `title`           | Short text       | Required, max 60 chars  |
| Description       | `description`     | Long text        | Required, max 160 chars |
| OG Image Title    | `ogImageTitle`    | Short text       | Optional, max 70 chars  |
| OG Image Subtitle | `ogImageSubtitle` | Short text       | Optional, max 100 chars |
| Keywords          | `keywords`        | Short text, List | Optional                |

### 2. Post Content Model

**Content Type ID**: `post`

| Field Name | Field ID  | Type        | Validation       | Description                     |
| ---------- | --------- | ----------- | ---------------- | ------------------------------- |
| Title      | `title`   | Short text  | Required         | Blog post title                 |
| Slug       | `slug`    | Short text  | Required, Unique | URL slug (e.g., "my-blog-post") |
| Date       | `date`    | Date & time | Required         | Publication date                |
| Content    | `content` | Rich text   | Required         | Main blog content               |
| SEO        | `seo`     | Reference   | Optional         | Link to SEO content model       |

**Rich Text Configuration**:

- Enable: Headings (H2-H6), Bold, Italic, Unordered List, Ordered List
- Enable: Hyperlinks, Entry Links, Asset Links
- Enable: Embedded Entries (for code blocks, embeds)

### 3. Page Content Model

**Content Type ID**: `page`

| Field Name | Field ID  | Type       | Validation       | Description               |
| ---------- | --------- | ---------- | ---------------- | ------------------------- |
| Title      | `title`   | Short text | Required         | Page title                |
| Slug       | `slug`    | Short text | Required, Unique | URL slug                  |
| Content    | `content` | Rich text  | Required         | Page content              |
| SEO        | `seo`     | Reference  | Optional         | Link to SEO content model |

### 4. Logbook Content Model

**Content Type ID**: `logbook`

| Field Name | Field ID   | Type        | Validation | Description     |
| ---------- | ---------- | ----------- | ---------- | --------------- |
| Title      | `title`    | Short text  | Required   | Entry title     |
| Date       | `date`     | Date & time | Required   | Entry date      |
| Content    | `content`  | Rich text   | Required   | Journey content |
| Location   | `location` | Short text  | Optional   | Location info   |

### 5. Embedded Content Models

#### CodeBlock Content Model

**Content Type ID**: `codeBlock`

| Field Name | Field ID   | Type       | Description          |
| ---------- | ---------- | ---------- | -------------------- |
| Language   | `language` | Short text | Programming language |
| Code       | `code`     | Long text  | Code content         |
| Filename   | `filename` | Short text | Optional filename    |

#### Tweet Embed Content Model

**Content Type ID**: `tweet`

| Field Name | Field ID | Type       | Description       |
| ---------- | -------- | ---------- | ----------------- |
| Tweet URL  | `url`    | Short text | Full Twitter URL  |
| Tweet ID   | `id`     | Short text | Twitter status ID |

## Content Creation Workflow

### 1. Creating a Blog Post

1. **Navigate to Content** in Contentful
2. **Click "Add entry"** and select "Post"
3. **Fill required fields**:

   - **Title**: Your blog post title
   - **Slug**: URL-friendly version (e.g., "my-first-blog-post")
   - **Date**: Publication date
   - **Content**: Rich text content

4. **Add SEO** (recommended):

   - Click "Add entry" in SEO field
   - Fill in title, description, and OG image texts
   - Save the SEO entry first

5. **Content Formatting Tips**:
   - Use H2-H4 for structure
   - Add embedded code blocks for syntax highlighting
   - Use entry links for internal references
   - Add images via asset uploads

### 2. Rich Text Best Practices

#### Embedding Code Blocks

1. Create a CodeBlock entry:

   - **Language**: `javascript`, `python`, `bash`, etc.
   - **Code**: Your code snippet
   - **Filename**: Optional file reference

2. In your post content:
   - Place cursor where you want the code
   - Click "Embed entry"
   - Select your CodeBlock entry

#### Adding Images

1. Upload assets to Contentful media library
2. In rich text editor, click "Insert media"
3. Select your image
4. Add alt text for accessibility

### 3. Content States

- **Draft**: Work in progress, not visible on site
- **Changed**: Modified content, needs republishing
- **Published**: Live content visible on website
- **Archived**: Removed from website but preserved

## Webhook Automation

### 1. Webhook Configuration

1. **Go to Settings > Webhooks** in Contentful
2. **Click "Add webhook"**
3. **Configure webhook**:

   - **Name**: "Auto Revalidate Website"
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Method**: POST
   - **Headers**:
     ```
     Content-Type: application/json
     x-revalidate-secret: your_revalidation_secret
     ```

4. **Set Triggers**:

   - ✅ Publish
   - ✅ Unpublish
   - ✅ Entry (Content Events)

5. **Set Filters**:
   - Environment ID equals "master"

### 2. How Webhooks Work

When you publish/unpublish content:

1. **Contentful sends webhook** to your API endpoint
2. **API validates secret** for security
3. **Extracts content type and slug** from payload
4. **Calls `revalidatePath()`** to refresh specific pages
5. **Returns success response** to Contentful

### 3. Supported Revalidation Paths

- **Blog posts**: `/writing/[slug]` and `/writing`
- **Pages**: `/[slug]`
- **Journey entries**: `/journey`

## Caching Mechanisms

### 1. Multi-Layer Caching

This project implements a sophisticated caching strategy:

#### Layer 1: Contentful API Cache

```javascript
// In lib/contentful.js
const response = await fetch(url, {
  cache: 'force-cache' // Aggressive caching
})
```

#### Layer 2: React Cache

```javascript
// Function-level caching
export const getAllPosts = cache(async () => {
  // Cached function calls
})
```

#### Layer 3: Next.js Static Generation

```javascript
// Page-level static generation
export async function generateStaticParams() {
  // Pre-built at build time
}
```

#### Layer 4: Vercel Edge Cache

- Automatic edge caching for static pages
- CDN distribution globally

### 2. Cache Invalidation Strategy

#### Manual Revalidation

```bash
# Revalidate specific post
curl -X POST 'https://your-site.com/api/revalidate' \
  -H 'Content-Type: application/json' \
  -H 'x-revalidate-secret: your_secret' \
  -d '{"contentTypeId": "post", "slug": "your-post-slug"}'
```

#### Automatic via Webhooks

- **Publish content** → Webhook triggers → Automatic revalidation
- **No manual intervention required**

### 3. Cache Behavior by Content Type

| Content Type | Cache Duration      | Revalidation Trigger   |
| ------------ | ------------------- | ---------------------- |
| Posts        | Build time + manual | Publish/Unpublish      |
| Pages        | Build time + manual | Publish/Unpublish      |
| Journey      | Build time + manual | Any logbook change     |
| SEO data     | Build time + manual | Related content change |

## SEO Optimization

### 1. SEO Content Model Usage

Every post and page should have an SEO entry:

```javascript
// Example SEO configuration
{
  title: "How to Build a Blog with Next.js - Developer Guide",
  description: "Learn to build a modern blog using Next.js, Contentful CMS, and Vercel deployment. Complete tutorial with code examples.",
  ogImageTitle: "Next.js Blog Tutorial",
  ogImageSubtitle: "Complete Developer Guide",
  keywords: ["nextjs", "blog", "contentful", "tutorial"]
}
```

### 2. Automatic OG Image Generation

The project automatically generates Open Graph images using:

- SEO title and subtitle
- Consistent branding
- Optimized dimensions (1200x630)

### 3. SEO Best Practices

#### Title Optimization

- Keep under 60 characters
- Include primary keyword
- Make it compelling for clicks

#### Description Optimization

- Keep under 160 characters
- Include call-to-action
- Summarize main value

#### Slug Best Practices

- Use hyphens, not underscores
- Keep concise but descriptive
- Include primary keyword
- Example: `nextjs-contentful-blog-tutorial`

## Troubleshooting

### 1. Common Issues

#### "Entry not found" Errors

**Problem**: Blog post returns 404 **Solution**:

- Verify slug matches exactly
- Check if post is published
- Confirm content model fields are correct

#### Webhook Not Triggering

**Problem**: Content updates don't reflect on site **Solution**:

- Check webhook activity log in Contentful
- Verify secret header is correct
- Test webhook manually with curl

#### Images Not Loading

**Problem**: Images from Contentful don't display **Solution**:

- Verify asset is published
- Check image URL in browser
- Ensure proper alt text is set

### 2. Development Debugging

#### Enable Verbose Logging

```javascript
// In lib/contentful.js
console.log('Fetching posts:', { spaceId, limit, skip })
console.log('API response:', response.status)
```

#### Test Content API

```bash
# Test Contentful API directly
curl "https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?content_type=post" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Verify Environment Variables

```javascript
// Add to your API route
console.log({
  spaceId: process.env.CONTENTFUL_SPACE_ID ? 'Set' : 'Missing',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ? 'Set' : 'Missing'
})
```

### 3. Performance Optimization

#### Content Delivery

- Use `cdn.contentful.com` for production
- Use `preview.contentful.com` for draft content
- Implement proper error boundaries

#### Image Optimization

```javascript
// In rich text renderer
const optimizeImageUrl = (url) => {
  return `${url}?w=800&h=450&fit=fill&f=webp&q=80`
}
```

#### Bundle Size

- Only import needed rich text node types
- Use dynamic imports for heavy components
- Monitor bundle analyzer reports

## Advanced Features

### 1. Content Preview

Enable draft content preview:

```javascript
// In page components
export async function generateStaticParams({ preview = false }) {
  const posts = await getAllPosts(preview)
  // Return params for preview mode
}
```

### 2. Localization Support

For multi-language content:

```javascript
// Content model field configuration
{
  "en-US": "English content",
  "fr-FR": "Contenu français"
}
```

### 3. Content Relationships

Link related posts:

```javascript
// In post content model
{
  relatedPosts: {
    type: 'Array',
    items: {
      type: 'Link',
      linkType: 'Entry'
    }
  }
}
```

---

This guide provides a complete overview of using Contentful with this blog project. For additional support, refer to the
[Contentful documentation](https://www.contentful.com/developers/docs/) or check the project's issue tracker.
