// app/api/generate-wiki-content/route.js
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge';

export async function POST(req: Request) {
    console.log('API route called');
  
    try {
        //parse prompt from req body?
      const pageTopic = await req.json()
      console.log(pageTopic)
      console.log(pageTopic.prompt)

      const prompt = `Generate a detailed wiki page about ${pageTopic.prompt}. Include a brief introduction, and several sections with headers. Give your response in the form of a simple html body, with heading tags and <a> tags to inline LINKS to related articles(not other sections in the same page). Most proper names should be links. Make sure the response is formatted as an html body.`;
  
      const result = await streamText({
        model: openai('gpt-4o'), // Use the completion model
        prompt, // Use the constructed prompt
        maxTokens: 1500,
        temperature: 0.7,
      });
  
      console.log('Stream generated successfully');
      return result.toAIStreamResponse();
    } catch (error) {
      console.error('Error in API route:', error);
      return new Response(JSON.stringify({ error: 'An error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }