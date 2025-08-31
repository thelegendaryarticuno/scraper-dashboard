import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

// Helper function to extract domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.toLowerCase();
    } catch (error) {
        throw new Error('Invalid URL format');
    }
}

// Helper function to merge arrays and remove duplicates
function mergeUniqueArrays(existing, newItems) {
    if (!Array.isArray(existing)) existing = [];
    if (!Array.isArray(newItems)) newItems = [];
    
    const combined = [...existing, ...newItems];
    return [...new Set(combined)]; // Remove duplicates
}

export async function POST(request) {
    try {
        // Parse the request body
        const websiteData = await request.json();
        
        // Validate required fields
        const { sourceUrl, phone, email, otherLinks, savedAt } = websiteData;
        if (!sourceUrl) {
            return NextResponse.json(
                { error: 'sourceUrl is a required field' },
                { status: 400 }
            );
        }

        // Extract domain from URL
        let domain;
        try {
            domain = extractDomain(sourceUrl);
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Validate arrays
        const phoneArray = Array.isArray(phone) ? phone : [];
        const emailArray = Array.isArray(email) ? email : [];
        const linksArray = Array.isArray(otherLinks) ? otherLinks : [];

        // Validate email formats in email array
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const emailAddr of emailArray) {
            if (!emailRegex.test(emailAddr)) {
                return NextResponse.json(
                    { error: `Invalid email format: ${emailAddr}` },
                    { status: 400 }
                );
            }
        }

        // Connect to database
        const { db } = await connectToDatabase();
        const contactsCollection = db.collection('contacts'); // Changed to use contacts collection

        // Check if website with this domain already exists
        const existingWebsite = await contactsCollection.findOne({ domain });

        if (existingWebsite) {
            // Append new data to existing website
            const updatedData = {
                sourceUrl: sourceUrl,
                phone: mergeUniqueArrays(existingWebsite.phone, phoneArray),
                email: mergeUniqueArrays(existingWebsite.email, emailArray),
                otherLinks: mergeUniqueArrays(existingWebsite.otherLinks, linksArray),
                savedAt: savedAt ? new Date(savedAt) : new Date(),
                updatedAt: new Date()
            };

            const result = await contactsCollection.updateOne(
                { domain },
                { $set: updatedData }
            );

            // Get the updated document
            const updatedWebsite = await contactsCollection.findOne({ domain });

            return NextResponse.json(
                {
                    message: 'Website data updated successfully (appended new data)',
                    websiteId: updatedWebsite._id,
                    website: {
                        id: updatedWebsite._id,
                        domain: updatedWebsite.domain,
                        sourceUrl: updatedWebsite.sourceUrl,
                        phone: updatedWebsite.phone,
                        email: updatedWebsite.email,
                        otherLinks: updatedWebsite.otherLinks,
                        savedAt: updatedWebsite.savedAt,
                        createdAt: updatedWebsite.createdAt,
                        totalPhones: updatedWebsite.phone?.length || 0,
                        totalEmails: updatedWebsite.email?.length || 0,
                        totalLinks: updatedWebsite.otherLinks?.length || 0
                    }
                },
                { status: 200 }
            );
        } else {
            // Create new website entry
            const websiteToSave = {
                domain,
                sourceUrl: sourceUrl,
                phone: phoneArray,
                email: emailArray,
                otherLinks: linksArray,
                savedAt: savedAt ? new Date(savedAt) : new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await contactsCollection.insertOne(websiteToSave);

            return NextResponse.json(
                {
                    message: 'Website data created successfully',
                    websiteId: result.insertedId,
                    website: {
                        id: result.insertedId,
                        domain,
                        sourceUrl: sourceUrl,
                        phone: phoneArray,
                        email: emailArray,
                        otherLinks: linksArray,
                        savedAt: websiteToSave.savedAt,
                        totalPhones: phoneArray.length,
                        totalEmails: emailArray.length,
                        totalLinks: linksArray.length
                    }
                },
                { status: 201 }
            );
        }

    } catch (error) {
        console.error('Error processing website data:', error);
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Optional: Add GET method to retrieve websites
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const contactsCollection = db.collection('contacts');
        
        const websites = await contactsCollection.find({}).toArray();
        
        return NextResponse.json({
            websites: websites.map(website => ({
                id: website._id,
                domain: website.domain,
                sourceUrl: website.sourceUrl,
                phone: website.phone || [],
                email: website.email || [],
                otherLinks: website.otherLinks || [],
                totalPhones: (website.phone || []).length,
                totalEmails: (website.email || []).length,
                totalLinks: (website.otherLinks || []).length,
                createdAt: website.createdAt,
                updatedAt: website.updatedAt,
                savedAt: website.savedAt
            })),
            totalWebsites: websites.length
        });
    } catch (error) {
        console.error('Error fetching websites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
