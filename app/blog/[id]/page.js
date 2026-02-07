import { QdrantClient } from '@qdrant/js-client-rest';
import Blog from "../../../src/components/Blog.client";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const id = unwrappedParams.id;

  try {
    // Fetch directly from Qdrant
    const qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const numericId = !isNaN(id) ? Number(id) : id;
    const result = await qdrantClient.retrieve(process.env.QDRANT_COLLECTION_NAME, { ids: [numericId] });
    const blog = result[0];

    if (!blog) {
      return {
        title: 'Blog Post | Rec-er',
        description: "Trishant Pahwa's blog, journals, records, and researches",
      };
    }

    const title = blog.payload.title || `Blog Post ${id}`;
    const description = blog.payload.content?.substring(0, 160).replace(/[#*`]/g, '') || "Read this blog post on Rec-er";

    return {
      title: `${title} | Rec-er - Trishant Pahwa's Blog`,
      description: description,
      keywords: blog.payload.tags?.join(', ') || 'blog, programming, tech, coding, development',
      authors: [{ name: 'Trishant Pahwa' }],
      creator: 'Trishant Pahwa',
      publisher: 'Trishant Pahwa',
      openGraph: {
        title: title,
        description: description,
        url: `https://rec-er.trishantpahwa.com/blog/${id}`,
        siteName: 'Rec-er',
        type: 'article',
        publishedTime: blog.payload.createdAt || new Date().toISOString(),
        authors: ['Trishant Pahwa'],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        creator: '@trishantpahwa',
      },
      alternates: {
        canonical: `https://rec-er.trishantpahwa.com/blog/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Rec-er',
      description: "Trishant Pahwa's blog, journals, records, and researches",
    };
  }
}

async function BlogPage({ params }) {
  const unwrappedParams = await params;
  const id = unwrappedParams.id;

  let blogData = null;
  let blogContent = [];
  let codePens = [];

  const getCodePens = (md) => {
    const codePenHashRegex = new RegExp('<codepen src="(.*)" />', "gm");
    const codePenHash = md.match(codePenHashRegex);
    if (codePenHash && codePenHash.length) {
      return codePenHash.map((_codePenHash) =>
        _codePenHash.split('"')[1].split("/").pop()
      );
    } else return [];
  };

  try {
    // Fetch directly from Qdrant
    const qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const numericId = !isNaN(id) ? Number(id) : id;
    const result = await qdrantClient.retrieve(process.env.QDRANT_COLLECTION_NAME, { ids: [numericId] });
    const blog = result[0];

    if (blog) {
      blogData = {
        id: numericId,
        title: blog.payload.title,
        content: blog.payload.content,
        createdAt: new Date(numericId).toISOString(),
      };

      codePens = getCodePens(blogData.content.toString());
      blogContent = blogData.content.split(/<codepen src=".*" \/>/);
    }
  } catch (err) {
    console.error('Error fetching blog:', err);
  }

  // Generate JSON-LD structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogData?.title || `Blog Post ${id}`,
    author: {
      '@type': 'Person',
      name: 'Trishant Pahwa',
      url: 'https://trishantpahwa.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Trishant Pahwa',
    },
    datePublished: blogData?.createdAt || new Date().toISOString(),
    dateModified: blogData?.updatedAt || blogData?.createdAt || new Date().toISOString(),
    description: blogData?.content?.substring(0, 160).replace(/[#*`]/g, '') || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rec-er.trishantpahwa.com/blog/${id}`,
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen">
        <Blog id={id} markdownData={blogContent} codePens={codePens} blogData={blogData} />
      </article>
    </>
  );
}

export default BlogPage;
