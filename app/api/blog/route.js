import { QdrantClient } from '@qdrant/js-client-rest';
import { pipeline } from '@xenova/transformers';
import { NextResponse } from 'next/server';

// Initialize embedding model (cached)
let extractor = null;

async function getExtractor() {
    if (!extractor) {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
}

export async function POST(request) {
    try {
        const { title, content, password } = await request.json();

        if (!password || password !== process.env.PUBLISH_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 403 }
            );
        }

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Initialize Qdrant client
        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });

        const collectionName = process.env.QDRANT_COLLECTION_NAME;

        // Check if collection exists
        try {
            await qdrantClient.getCollection(collectionName);
        } catch (error) {
            if (error.status === 403) {
                return NextResponse.json(
                    { error: 'Authentication failed. Please check your QDRANT_API_KEY.' },
                    { status: 500 }
                );
            } else if (error.status === 404) {
                return NextResponse.json(
                    { error: `Collection '${collectionName}' does not exist. Please create it first.` },
                    { status: 500 }
                );
            } else {
                return NextResponse.json(
                    { error: 'Failed to access Qdrant collection', details: error.message },
                    { status: 500 }
                );
            }
        }

        // Generate unique ID
        const blogId = Date.now();

        // Generate embedding from title + content
        const textToEmbed = `${title} ${content}`;
        const embedder = await getExtractor();
        const embedding = await embedder(textToEmbed, { pooling: 'mean', normalize: true });

        // Upsert to Qdrant
        await qdrantClient.upsert(collectionName, {
            points: [
                {
                    id: blogId,
                    vector: Array.from(embedding.data),
                    payload: {
                        title: title,
                        content: content,
                        createdAt: new Date().toISOString(),
                    },
                }
            ],
        });

        return NextResponse.json({
            success: true,
            message: `Blog '${title}' published successfully`,
            id: blogId
        });

    } catch (error) {
        console.error('Error publishing blog:', error);
        return NextResponse.json(
            { error: 'Failed to publish blog', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    const searchQuery = request.nextUrl.searchParams.get('search') || '';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5', 5);
    if (!searchQuery) return NextResponse.json({ error: 'Search query is required' }, { status: 400 });

    try {
        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });
        const collectionName = process.env.QDRANT_COLLECTION_NAME;

        // If search query is provided, perform vector search

        // Generate embedding for search query
        const embedder = await getExtractor();
        const output = await embedder(searchQuery, { pooling: 'mean', normalize: true });
        const queryVector = Array.from(output.data);

        // Perform vector search
        const results = await qdrantClient.query(collectionName, {
            query: queryVector,
            limit: limit,
            with_payload: true,
        });

        // Format results
        const blogs = results.points.map(point => ({
            id: point.id,
            title: point.payload.title,
            content: point.payload.content,
            createdAt: point.payload.id,
            score: point.score,
        }));

        return NextResponse.json({
            success: true,
            query: searchQuery,
            count: blogs.length,
            results: blogs,
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs', details: error.message },
            { status: 500 }
        );
    }
}