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
            with_payload: true, // Include payload to get title
        });
        const metadataList = points.points.map(point => ({
            id: point.id,
            title: point.payload.title,
        }));
        return new Response(JSON.stringify(metadataList), { status: 200 });
    } catch (error) {
        console.error('Error fetching blog metadata:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch blog metadata', details: error.message }), { status: 500 });
    }
}