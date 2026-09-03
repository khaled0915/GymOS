"use server";

import { auth } from "@/lib/auth";
import { CoachService } from "@/services/coach.service";
import { revalidatePath } from "next/cache";

export async function generateProgramAction(options: {
  goal: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
  frequencyDays: 3 | 4 | 5 | 6;
  equipment?: "FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT";
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const program = await CoachService.createGeneratedProgram(session.user.id, options);
  revalidatePath("/programs");
  revalidatePath("/coach");
  return { success: true, programId: program.id };
}

/**
 * Server action for the AI Coach chat — processes user messages and returns
 * personalized, data-driven coaching responses.
 */
export async function sendCoachMessageAction(message: string): Promise<{
  reply: string;
  quickPrompts: string[];
}> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validate input
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      reply: "Please type a message so I can help you!",
      quickPrompts: [],
    };
  }
  if (trimmed.length > 500) {
    return {
      reply: "Please keep your message under 500 characters.",
      quickPrompts: [],
    };
  }

  return CoachService.getCoachResponse(session.user.id, trimmed);
}

/**
 * Server action to clear all chat history for the current user.
 */
export async function clearChatHistoryAction(): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await CoachService.clearChatHistory(session.user.id);
  revalidatePath("/coach");
  return { success: true };
}

