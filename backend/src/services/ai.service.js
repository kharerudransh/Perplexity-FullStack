import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage ,SystemMessage,AIMessage} from "langchain";


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

export async function generateResponse(messages,userName){
    const response = await model.invoke(messages.map(msg=>{
      SystemMessage(`
        You are a helpful assistant. You are talking to user ${userName} 
        keep your answer short and precise.
        Your answer should make sense and should be in easy language so that user can userstand it.
        Your task is to understand the user's query and provide the best possible response.
        Dont answer to any question which has terrorism , racism , discrimination , abuse or hate speech.
        Answer the question in same language as the user's question.
        Use the username sometimes in convo to make the answer more personal
        Your response should be friendly.
        Answer the question after analyzing it and make it more better
        If needed support your answer with example.
        If user ask you to generate code then provide the code in proper format.
        Always ask follow up questions regarding the users query so that you can understand it better.
        `);
        if(msg.role === "user"){
            return new HumanMessage(msg.content);
        }
        else{
            return new AIMessage(msg.content);
        }
    }));//convert msgs into array of HumanMessage and AIMessage objects
    return response.text;
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

    

