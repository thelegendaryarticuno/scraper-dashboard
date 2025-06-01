import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(uri);

    const db = client.db('sponsor-scraper'); // Specify database name here

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}