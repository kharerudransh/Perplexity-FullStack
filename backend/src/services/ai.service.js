import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import * as z from "zod"
import { tool, createAgent } from "langchain"
import { sendEmail } from "./mail.service.js"
import { getWeatherByCity } from "./weatherService.js"
import { searchTool } from "./search.service.js"
import { getLiveTrainStatus } from "./Train.service.js"
import { getLiveFlightStatus } from "./Flight.service.js"
import { getDirections } from "./maps.service.js";


const today = new Date().toLocaleDateString("en-IN", {
  year: 'numeric', month: 'long', day: 'numeric'
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7
});
const titleModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.1-flash-lite",
  temperature: 0.3,
});

const emailTool = tool(
  sendEmail,
  {
    name: "emailTool",
    description: "This is a Email Sender tool which is used to send the email where user asked to send ",
    schema: z.object({
      to: z.string().email("Invalid email address").describe("Recipient's Email Address"),
      subject: z.string().describe("Email Subject"),
      html: z.string().describe("HTML code of email"),
      text: z.string().optional().describe("Plain text version of email"),
    }),
  }
)

const weatherTool = tool(
  getWeatherByCity,
  {
    name: "getWeatherByCity",
    description: "This is a Weather Tool which is used to get the weather of any city",
    schema: z.object({
      cityName: z.string().describe("City Name"),
    }),
  }
)

const trainTool = tool(
  getLiveTrainStatus,
  {
    name: "getLiveTrainStatus",
    description: "This is a Train Tracking tool used to get live status, delay, and current position of an Indian train using its train number",
    schema: z.object({
      trainNumber: z.string().describe("Indian Railways train number, e.g. 12951"),
    }),
  }
);

const flightTool = tool(
  getLiveFlightStatus,
  {
    name: "getLiveFlightStatus",
    description: "This is a Flight Tracking tool used to get live status, delay, and schedule of a flight using its flight IATA code",
    schema: z.object({
      flightCode: z.string().describe("Flight IATA code, e.g. AI101"),
    }),
  }
);

const mapsTool = tool(
    getDirections,
    {
        name: "getDirections",
        description: "Get route, distance, and travel time between two locations. Use this when the user asks for directions or a route between two places (e.g. 'Delhi to Mumbai route').",
        schema: z.object({
            origin: z.string().describe("Starting location name, e.g. 'Delhi'"),
            destination: z.string().describe("Destination location name, e.g. 'Mumbai'"),
        }),
    }
);


export async function generateResponse(messages, userName) {
  try {
    const dynamicAgent = createAgent({
      model,
      tools: [emailTool, weatherTool, searchTool, trainTool, flightTool, mapsTool],
      systemPrompt: `You are a helpful assistant. Today's date is ${today}. You are talking to user ${userName}.
          TOOL PRIORITY RULES (follow strictly):
          - For live train status, delay, or current position of an Indian train → ALWAYS use getLiveTrainStatus tool FIRST. Never use search tool for train tracking queries.
          - For live flight status or delay → ALWAYS use getLiveFlightStatus tool FIRST. Never use search tool for flight tracking queries.
          - For general current events, news, or live scores (non-train, non-flight) → use search tool.
          - Only fall back to search tool for trains/flights if the tracking tool fails or returns an error.
          Keep your answer short and precise, in easy language so the user can understand it.
          Don't answer questions involving terrorism, racism, discrimination, abuse or hate speech.
          Answer in the same language as the user's question. Use the username sometimes to make the conversation personal. Be friendly.
          Support your answer with examples when helpful. If the user asks for code, format it properly.
          Ask follow-up questions when it helps you understand the query better.
          If any question is related to maps use mapsTool
          For ANY question about current events, live scores, news, or time-sensitive information, you MUST use the search tool first — never rely on your training data or memory.
          CRITICAL: Only state facts explicitly present in the search results. Do NOT fill in missing details with your own estimates. If a detail is missing, say so instead of guessing.`
    });

    const formattedMessages = messages.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    });

    const response = await dynamicAgent.invoke({
      messages: formattedMessages
    });

    return response.messages[response.messages.length - 1].content;
  } catch (err) {
    console.error("generateResponse failed:", err);
    return "Sorry, something went wrong while processing your request. Please try again.";
  }
}


export async function generateChatTitle(message) {
  try {
    const response = await titleModel.invoke([
      new SystemMessage("You are a Title Generator which can generate a title for a conversation between user and Ai agent. give a title to this conversation so that user can understand the topic of the chat and keep it short:"),
      new HumanMessage(`
          Generate the title for the chat around 2-3 words so that user can remember about the conversation by reading title only.
          ${message}
          `)
    ]);
    return response.content;
  } catch (err) {
    console.error("generateChatTitle failed:", err);
    return "New Chat";
  }
}