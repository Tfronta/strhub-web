import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN || process.env.CONTENTFUL_CPA_TOKEN;

export async function POST(request: NextRequest) {
  try {
    if (!CMA_TOKEN) {
      console.error("CONTENTFUL_CMA_TOKEN or CONTENTFUL_CPA_TOKEN is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate field lengths based on Contentful schema
    if (name.length < 5 || name.length > 200) {
      return NextResponse.json(
        { error: "Name must be between 5 and 200 characters" },
        { status: 400 }
      );
    }

    if (subject.length < 5 || subject.length > 500) {
      return NextResponse.json(
        { error: "Subject must be between 5 and 500 characters" },
        { status: 400 }
      );
    }

    if (message.length < 20 || message.length > 500) {
      return NextResponse.json(
        { error: "Message must be between 20 and 500 characters" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w[\w.-]*@([\w-]+\.)+[\w-]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create Contentful Management API client
    const client = createClient({
      accessToken: CMA_TOKEN,
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT);

    // Create the entry
    const entry = await environment.createEntry("contact", {
      fields: {
        name: {
          "en-US": name,
        },
        email: {
          "en-US": email,
        },
        subject: {
          "en-US": subject,
        },
        message: {
          "en-US": message,
        },
      },
    });

    // Publish the entry
    await entry.publish();

    return NextResponse.json(
      { success: true, id: entry.sys.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contact entry:", error);
    
    // Handle Contentful-specific errors
    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data.message || "Failed to create contact entry" },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create contact entry" },
      { status: 500 }
    );
  }
}

