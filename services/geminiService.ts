import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Global state to manage rate limiting across the app
let cooldownUntil = 0;

/**
 * Checks if the service is currently in a cooldown period due to rate limiting (Error 429).
 */
export const isCoolingDown = () => Date.now() < cooldownUntil;

/**
 * Sets a cooldown period (default 60 seconds) when a 429 error is detected.
 */
const startCooldown = () => {
  cooldownUntil = Date.now() + 60000; // 60 second block
};

/**
 * Check if API Key is present in the environment
 */
export const isApiKeyPresent = () => !!process.env.API_KEY;

/**
 * Extracts the generated text and strips any URLs, source links, or grounding metadata headers.
 */
function processResponse(response: GenerateContentResponse): string {
  let text = response.text || "";
  
  // 1. Specifically target common headers for grounding sources
  const sourceHeaders = [
    /Sources Found:/gi,
    /Sources:/gi,
    /Grounding Sources:/gi,
    /Relevant links:/gi
  ];
  
  sourceHeaders.forEach(pattern => {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      // Remove everything from the header onwards
      text = text.substring(0, match.index);
    }
  });

  // 2. Remove any remaining URLs (http, https, www)
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  text = text.replace(urlPattern, "");

  // 3. Remove bracketed citations like [1], [2], [1, 2]
  const citationPattern = /\[\d+(?:,\s*\d+)*\]/g;
  text = text.replace(citationPattern, "");

  // 4. Clean up trailing artifacts like bullet points or "•" left at the end
  text = text.replace(/[\s•\-*]+$/g, "");

  return text.trim();
}

/**
 * Fetches real-time Indian market indices using Google Search grounding.
 */
export async function fetchLiveMarketData() {
  if (!isApiKeyPresent()) return "ERROR_NO_KEY";
  if (isCoolingDown()) return "RATE_LIMIT_ACTIVE";
  
  try {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Current live price and today's change for NIFTY 50, SENSEX, and BANK NIFTY indices. 
      Format exactly like this for each: [NAME: NIFTY 50 | PRICE: 24850.25 | CHANGE: 110.50 | PERCENT: 0.45].
      IMPORTANT: Provide ONLY the data. Do NOT include any URLs, source links, website references, or citations.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    return processResponse(response);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      startCooldown();
      return "RATE_LIMIT_ACTIVE";
    }
    return "ERROR_FETCH_FAILED";
  }
}

/**
 * Fetches Top 5 Gainers and Losers for the NSE.
 */
export async function fetchTopMovers() {
  if (!isApiKeyPresent() || isCoolingDown()) return null;
  
  try {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `List the top 5 Gainers and top 5 Losers in the Nifty 50 for today. 
      Format strictly as bracketed items: [SYMBOL: RELIANCE | PRICE: 2950.40 | PERCENT: 3.45 | TYPE: GAINER].
      Provide only these 10 items. No URLs or headers.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    return processResponse(response);
  } catch (error) {
    return null;
  }
}

/**
 * Fetches current market prices for a batch of stock symbols.
 */
export async function fetchBatchCMPs(symbols: string[]) {
  if (symbols.length === 0 || !isApiKeyPresent() || isCoolingDown()) return null;
  
  try {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Fetch the current market price for these specific Indian stocks: ${symbols.join(', ')}. 
      Format strictly as a list of bracketed items: [SYMBOL: PRICE]. 
      Example output: [RELIANCE: 2950.40] [TCS: 3820.15] [NIFTY_AUG_FUT: 24500.00].
      DO NOT include any URLs, source links, or citations.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    return processResponse(response);
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      startCooldown();
    }
    return null;
  }
}

export async function fetchLatestMarketNews() {
  if (!isApiKeyPresent()) return "API Key missing in Vercel settings.";
  if (isCoolingDown()) return "Rate limit reached. Data will refresh shortly.";
  
  try {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Top 5 Indian financial market news headlines for today with brief 1-sentence summaries. Bullet points only. IMPORTANT: DO NOT include any URLs, source links, website references, or citations. Provide only news content.",
      config: { tools: [{ googleSearch: {} }] },
    });

    return processResponse(response);
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
      startCooldown();
      return "System is cooling down (429). Please refresh in 60s.";
    }
    return "Market news update temporarily unavailable.";
  }
}

export async function getMarketInsights(newsSummary: string) {
  if (!isApiKeyPresent() || isCoolingDown() || !newsSummary) return "Analyzing market trends...";
  
  try {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this news: ${newsSummary}, provide a 1-sentence market sentiment summary for an investor. DO NOT include any URLs, citations, or source links.`,
    });
    return processResponse(response) || "Market sentiment is stable.";
  } catch (error) {
    return "Market sentiment analysis paused.";
  }
}