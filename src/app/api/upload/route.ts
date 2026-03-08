import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    // Security Check: Ensure only authenticated Admins can upload files
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Here we could add logic to validate the pathname or file type
                return {
                    allowedContentTypes: ['video/mp4', 'application/pdf', 'image/jpeg', 'image/png'],
                    tokenPayload: JSON.stringify({
                        userId: session.user.id,
                        role: "ADMIN"
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Runs after the upload successfully hits Vercel Blob.
                // We could log this to the database, but since our creation form 
                // receives the final blob URL on the client, we don't strictly *need* to save here.
                console.log('blob upload completed', blob, tokenPayload);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
