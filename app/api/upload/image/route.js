import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return new Response(JSON.stringify({ error: 'No image file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return new Response(JSON.stringify({ error: 'File too large. Maximum size is 5MB.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;

        // Upload to Vercel Blob
        const blob = await put(`${fileName}`, file, {
            access: 'public',
            contentType: file.type,
        });

        return new Response(JSON.stringify({
            success: true,
            imageUrl: blob.url,
            fileName
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return new Response(JSON.stringify({
            error: 'Failed to upload image',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}