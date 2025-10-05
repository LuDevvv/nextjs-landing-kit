import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/email.service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("📅 Calendly webhook received:", {
      event: payload.event,
      timestamp: new Date().toISOString(),
    });

    // Handle different Calendly events
    switch (payload.event) {
      case "invitee.created":
        await handleInviteeCreated(payload);
        break;

      case "invitee.canceled":
        await handleInviteeCanceled(payload);
        break;

      default:
        console.log("⚠️ Unhandled Calendly event:", payload.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Calendly webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleInviteeCreated(payload: any) {
  const invitee = payload.payload.invitee;
  const event = payload.payload.event;

  console.log("✅ New booking created:", {
    name: invitee.name,
    email: invitee.email,
    eventName: event.name,
    startTime: event.start_time,
  });

  // Optional: Send notification email to team
  // await emailService.sendEmail({...})

  // Optional: Update CRM, database, etc.
}

async function handleInviteeCanceled(payload: any) {
  const invitee = payload.payload.invitee;
  const event = payload.payload.event;

  console.log("❌ Booking canceled:", {
    name: invitee.name,
    email: invitee.email,
    eventName: event.name,
  });

  // Optional: Send cancellation notification
  // Optional: Update CRM, database, etc.
}
