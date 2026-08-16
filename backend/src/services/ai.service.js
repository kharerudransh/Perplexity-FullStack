import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage ,SystemMessage,AIMessage} from "langchain";
import * as z from "zod"
import { tool , createAgent } from "langchain" 
import {sendEmail} from "./mail.service.js"
import {getWeatherByCity} from "./weatherService.js"
import {searchTool} from "./search.service.js"  



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
  model: "gemini-3.1-flash-lite",   // ya "gemini-flash-lite-latest" agar available
  temperature: 0.3,  // titles ke liye kam creativity chahiye, consistent output
});


//tool setup email
const emailTool=tool(
  //1. function used there
  sendEmail,
  //2. name and description of tool
  {
    name:"emailTool",
    description:"This is a Email Sender tool which is used to send the email where user asked to send ",
    //3. Input jo tool expect karega
    schema:z.object({
      to:z.string().email("Invalid email address").describe("Recipient's Email Address"),
      subject:z.string().describe("Email Subject"),
      html:z.string().describe("HTML code of email"),
      text:z.string().describe("Text version of email"),
    }),
  }
)

//Weather tool 
const weatherTool=tool(
  //1. function used there
    getWeatherByCity,
    {
      //2. name and description of tool
      name:"getWeatherByCity",
      description:"This is a Weather Tool which is used to get the weather of any city",
      //3. Input jo tool expect karega
      schema:z.object({
        cityName:z.string().describe("City Name"),
      }),
    }
  )

const agent=createAgent({
    model,
    tools:[emailTool,weatherTool,searchTool],
    systemPrompt: `You are a helpful assistant. Today's date is ${today}.For ANY question about current events, live scores, news, or time-sensitive information, you MUST use the search tool first — never rely on your training data or memory for such queries.
    CRITICAL: Only state facts that are explicitly present in the search results. Do NOT fill in missing details (like specific scores, stats, or numbers) with your own estimates or training knowledge. If the search results don't include a specific detail, say "I don't have that specific detail from the search results" instead of guessing.`
})
export async function generateResponse(messages, userName) {
    const formattedMessages = messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        }
        else {
            return new AIMessage(msg.content);
        }
    });

    const response = await agent.invoke({
        messages: formattedMessages   // ← object-shape mein wrap kiya
    });

    return response.messages[response.messages.length - 1].content;
}

export async function generateChatTitle(message){
    const response = await titleModel.invoke([
      new SystemMessage("You are a Title Generator which can generate a title for a conversation between user and Ai agent. give a title to this conversation so that user can understand the topic of the chat and keep it short:"),
      new HumanMessage(`
        Generate  the title for the chat around 2-3 words so that user can remeber about the conversation by reading title only.
        ${message}
        
        `)]);
    return response.text;
}

    

