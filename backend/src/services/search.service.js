import { TavilySearch } from "@langchain/tavily";


export const searchTool = new TavilySearch({
    maxResults: 5,
    topic: "general",   // "news" bhi use kar sakte ho current-events wale queries ke liye
});