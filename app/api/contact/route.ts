import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful-management";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// 5 messages per hour per client, 60 per hour overall.
const CONTACT_MAX_PER_CLIENT = 5;
const CONTACT_MAX_GLOBAL = 60;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;
const MAX_BODY_BYTES = 8 * 1024;

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

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const ip = clientIp(request);
    const perClient = rateLimit(`contact:${ip}`, CONTACT_MAX_PER_CLIENT, CONTACT_WINDOW_MS);
    const global = perClient.ok
      ? rateLimit("contact:global", CONTACT_MAX_GLOBAL, CONTACT_WINDOW_MS)
      : perClient;
    if (!perClient.ok || !global.ok) {
      const retry = perClient.ok ? global.retryAfterSeconds : perClient.retryAfterSeconds;
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retry) } }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
      if (!body || typeof body !== "object") throw new Error("not an object");
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Honeypot: real users never fill this field. Answer as if it succeeded so
    // bots do not learn they were filtered.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

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
    // Log details server-side only; never echo Contentful's error to the client.
    console.error("Error creating contact entry:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to send the message. Please try again later." },
      { status: 500 }
    );
  }
}

