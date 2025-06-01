import { connectToDatabase } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const contact = await db.collection('contacts').findOne({ _id: params.id });
    
    if (!contact) {
      return new Response(JSON.stringify({ error: 'Contact not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(contact), {
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