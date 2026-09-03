/**
 * Gemini AI client — singleton for server-side Gemini API calls.
 *
 * Requires GEMINI_API_KEY environment variable.
 * Falls back gracefully when the key is missing (returns null).
 */

import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

/**
 * Get the Gemini client singleton.
 * Returns null if GEMINI_API_KEY is not configured.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  if (!_client) {
    _client = new GoogleGenAI({ apiKey });
  }

  return _client;
}

/** The model to use for coach conversations. */
export const COACH_MODEL = "gemini-3.6-flash";
