import { connectToDatabase } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const website = await db.collection('websites').findOne({ _id: params.id });
    
    if (!website) {
      return new Response(JSON.stringify({ error: 'Website not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(website), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}