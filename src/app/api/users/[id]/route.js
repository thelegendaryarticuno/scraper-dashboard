import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid website ID format' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const websitesCollection = db.collection('websites');
        
        const website = await websitesCollection.findOne({ _id: new ObjectId(id) });
        
        if (!website) {
            return NextResponse.json(
                { error: 'Website not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            website: {
                id: website._id,
                domain: website.domain,
                url: website.url,
                phoneNumbers: website.phoneNumbers || [],
                emails: website.emails || [],
                links: website.links || [],
                totalPhones: (website.phoneNumbers || []).length,
                totalEmails: (website.emails || []).length,
                totalLinks: (website.links || []).length,
                createdAt: website.createdAt,
                updatedAt: website.updatedAt,
                lastScrapedAt: website.lastScrapedAt
            }
        });
    } catch (error) {
        console.error('Error fetching website:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

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

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid website ID format' },
                { status: 400 }
            );
        }

        const updates = await request.json();
        
        // Validate URL if it's being updated
        if (updates.url) {
            try {
                extractDomain(updates.url);
            } catch (error) {
                return NextResponse.json(
                    { error: 'Invalid URL format' },
                    { status: 400 }
                );
            }
        }

        // Validate email formats in email array if provided
        if (updates.emails && Array.isArray(updates.emails)) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            for (const email of updates.emails) {
                if (!emailRegex.test(email)) {
                    return NextResponse.json(
                        { error: `Invalid email format: ${email}` },
                        { status: 400 }
                    );
                }
            }
        }

        const { db } = await connectToDatabase();
        const websitesCollection = db.collection('websites');
        
        // Check if website exists
        const existingWebsite = await websitesCollection.findOne({ _id: new ObjectId(id) });
        if (!existingWebsite) {
            return NextResponse.json(
                { error: 'Website not found' },
                { status: 404 }
            );
        }

        // Prepare update data - merge arrays if provided
        const updateData = {
            updatedAt: new Date()
        };

        if (updates.url) {
            updateData.url = updates.url;
            updateData.domain = extractDomain(updates.url);
        }

        if (updates.phoneNumbers) {
            updateData.phoneNumbers = mergeUniqueArrays(
                existingWebsite.phoneNumbers, 
                updates.phoneNumbers
            );
        }

        if (updates.emails) {
            updateData.emails = mergeUniqueArrays(
                existingWebsite.emails, 
                updates.emails
            );
        }

        if (updates.links) {
            updateData.links = mergeUniqueArrays(
                existingWebsite.links, 
                updates.links
            );
        }

        // Update website
        const result = await websitesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Website not found' },
                { status: 404 }
            );
        }

        // Get updated website
        const updatedWebsite = await websitesCollection.findOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            message: 'Website updated successfully',
            website: {
                id: updatedWebsite._id,
                domain: updatedWebsite.domain,
                url: updatedWebsite.url,
                phoneNumbers: updatedWebsite.phoneNumbers || [],
                emails: updatedWebsite.emails || [],
                links: updatedWebsite.links || [],
                totalPhones: (updatedWebsite.phoneNumbers || []).length,
                totalEmails: (updatedWebsite.emails || []).length,
                totalLinks: (updatedWebsite.links || []).length,
                createdAt: updatedWebsite.createdAt,
                updatedAt: updatedWebsite.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating website:', error);
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid website ID format' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const websitesCollection = db.collection('websites');
        
        const result = await websitesCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Website not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Website deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting website:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
