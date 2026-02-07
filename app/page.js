import { QdrantClient } from '@qdrant/js-client-rest';
import Home from '../src/components/Home.client';
import figlet from "figlet";
import standard from "figlet/importable-fonts/Standard.js";

export const metadata = {
    title: 'Rec-er - Trishant Pahwa\'s Blog',
    description: "Trishant Pahwa's blog, journals, records, and researches. Interactive terminal-style interface for exploring technical articles and thoughts.",
    keywords: 'blog, programming, tech, coding, development, software engineering, Trishant Pahwa, rec-er, terminal, command line',
    authors: [{ name: 'Trishant Pahwa' }],
    creator: 'Trishant Pahwa',
    publisher: 'Trishant Pahwa',
    openGraph: {
        title: 'Rec-er - Trishant Pahwa\'s Blog',
        description: "Trishant Pahwa's blog, journals, records, and researches. Interactive terminal-style interface.",
        url: 'https://rec-er.trishantpahwa.com',
        siteName: 'Rec-er',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rec-er - Trishant Pahwa\'s Blog',
        description: "Interactive terminal-style blog interface",
        creator: '@trishantpahwa',
    },
    alternates: {
        canonical: 'https://rec-er.trishantpahwa.com',
    },
};

async function getBlogMetadata() {
    try {
        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });

        const points = await qdrantClient.scroll(process.env.QDRANT_COLLECTION_NAME, {
            limit: 10000,
            with_payload: true,
            with_vector: false,
        });

        // Transform to the format expected by the client component
        const blogList = {};
        points.points.forEach(point => {
            blogList[point.id] = {
                Title: point.payload.title || `Blog ${point.id}`,
            };
        });

        return blogList;
    } catch (error) {
        console.error('Error fetching blog metadata from Qdrant:', error);
        return {};
    }
}

async function getFigletText() {
    figlet.parseFont("Standard", standard);
    return await figlet.textSync(
        "Rec-er",
        {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 100,
            whitespaceBreak: true,
        }
    );
}

export default async function HomePage() {
    const blogList = await getBlogMetadata();
    const figletText = await getFigletText();

    return <Home initialBlogList={blogList} figletText={figletText} />;
}