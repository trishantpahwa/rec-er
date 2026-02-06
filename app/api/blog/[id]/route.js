import { QdrantClient } from "@qdrant/js-client-rest";

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
        });

        const numericId = !isNaN(id) ? Number(id) : id;

        const result = await qdrantClient.retrieve(process.env.QDRANT_COLLECTION_NAME, { ids: [numericId] });
        const blog = result[0];

        if (!blog) {
            return new Response("Blog not found", { status: 404 });
        }

        return new Response(JSON.stringify({ id: numericId, title: blog.payload.title, content: blog.payload.content }), { status: 200 });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return new Response("Error fetching blog", { status: 500 });
    }
}
