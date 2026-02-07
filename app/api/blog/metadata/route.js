import { QdrantClient } from '@qdrant/js-client-rest';

export async function GET() {
    try {
        // Initialize Qdrant client
        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });
        // Fetch all points (metadata) from the collection
        const points = await qdrantClient.scroll(process.env.QDRANT_COLLECTION_NAME, {
            limit: 10000, // Adjust as needed
            with_payload: true, // Include payload to get title and other metadata
        });
        const metadataList = points.points.map(point => ({
            id: point.id,
            title: point.payload.title,
            createdAt: point.payload.createdAt,
            updatedAt: point.payload.updatedAt,
        }));
        
        // Add cache headers for better performance
        return new Response(JSON.stringify(metadataList), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Error fetching blog metadata:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch blog metadata', details: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}