import { QdrantClient } from '@qdrant/js-client-rest';

export default async function sitemap() {
  const baseUrl = 'https://rec-er.trishantpahwa.com';

  // Get all blog posts directly from Qdrant
  let blogs = [];
  try {
    const qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const points = await qdrantClient.scroll(process.env.QDRANT_COLLECTION_NAME, {
      limit: 10000,
      with_payload: true,
    });

    blogs = points.points.map(point => ({
      id: point.id,
      title: point.payload.title,
      createdAt: point.payload.createdAt,
      updatedAt: point.payload.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // Generate blog post URLs
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.id}`,
    lastModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/new-blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  return [...routes, ...blogUrls];
}
