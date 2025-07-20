import OpenAI from "openai";
import Note from "../models/Note.js";

// Function to get or create OpenAI client
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.");
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function chatWithAI(req, res) {
  try {
    const openai = getOpenAIClient();
    
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ 
        message: "Message is required" 
      });
    }

    // Get user's notes for context if requested
    let notesContext = "";
    if (context === "notes") {
      try {
        const notes = await Note.find().sort({ createdAt: -1 }).limit(10);
        notesContext = `\n\nUser's recent notes for context:\n${notes.map(note => 
          `Title: ${note.title}\nContent: ${note.content}\n---`
        ).join('\n')}`;
      } catch (error) {
        console.log("Error fetching notes for context:", error);
      }
    }

    const systemPrompt = `You are a helpful AI assistant for TaskFlow, a note-taking application. You help users with:
1. Writing and organizing notes
2. Brainstorming ideas
3. Summarizing content
4. Improving writing
5. General productivity advice

Be helpful, concise, and friendly. If the user asks about their notes and context is provided, use that information.${notesContext}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.status(200).json({
      message: aiResponse,
      usage: completion.usage
    });

  } catch (error) {
    console.error("Error in chatWithAI controller:", error);
    
    if (error.message.includes("OpenAI API key not configured")) {
      return res.status(503).json({ 
        message: "AI features are currently unavailable. Please configure the OpenAI API key." 
      });
    }
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        message: "AI service quota exceeded. Please try again later." 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        message: "AI service configuration error. Please contact support." 
      });
    }

    res.status(500).json({ 
      message: "AI service temporarily unavailable. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function generateNoteIdeas(req, res) {
  try {
    const openai = getOpenAIClient();
    
    const { topic, style } = req.body;

    if (!topic) {
      return res.status(400).json({ 
        message: "Topic is required" 
      });
    }

    const stylePrompt = style === 'bullet' ? 'in bullet point format' : 
                       style === 'detailed' ? 'with detailed explanations' : 
                       'in a structured format';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a creative writing assistant. Generate helpful note ideas and content based on user requests." 
        },
        { 
          role: "user", 
          content: `Generate ideas and content for a note about "${topic}" ${stylePrompt}. Provide a suggested title and comprehensive content.` 
        }
      ],
      max_tokens: 400,
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    
    // Try to extract title and content from the response
    const lines = response.split('\n');
    let title = topic;
    let content = response;
    
    // Look for title patterns
    const titleLine = lines.find(line => 
      line.toLowerCase().includes('title:') || 
      line.toLowerCase().includes('# ')
    );
    
    if (titleLine) {
      title = titleLine.replace(/title:/i, '').replace(/# /, '').trim();
      content = lines.filter(line => line !== titleLine).join('\n').trim();
    }

    res.status(200).json({
      title,
      content,
      fullResponse: response
    });

  } catch (error) {
    console.error("Error in generateNoteIdeas controller:", error);
    
    if (error.message.includes("OpenAI API key not configured")) {
      return res.status(503).json({ 
        message: "AI features are currently unavailable. Please configure the OpenAI API key." 
      });
    }
    
    res.status(500).json({ 
      message: "Failed to generate note ideas",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function improveNote(req, res) {
  try {
    const openai = getOpenAIClient();
    
    const { title, content, improvementType } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        message: "Title and content are required" 
      });
    }

    let prompt;
    switch (improvementType) {
      case 'grammar':
        prompt = `Please fix grammar and spelling errors in this note while maintaining the original meaning and tone:`;
        break;
      case 'clarity':
        prompt = `Please improve the clarity and readability of this note while keeping the same information:`;
        break;
      case 'expand':
        prompt = `Please expand and add more detail to this note with relevant information:`;
        break;
      case 'summarize':
        prompt = `Please create a concise summary of this note while keeping the key points:`;
        break;
      default:
        prompt = `Please improve this note by making it clearer, more organized, and better written:`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful writing assistant. Improve notes while maintaining the user's voice and intent." 
        },
        { 
          role: "user", 
          content: `${prompt}\n\nTitle: ${title}\nContent: ${content}` 
        }
      ],
      max_tokens: 600,
      temperature: 0.3,
    });

    const improvedNote = completion.choices[0].message.content;

    res.status(200).json({
      improvedNote,
      originalTitle: title,
      originalContent: content,
      improvementType
    });

  } catch (error) {
    console.error("Error in improveNote controller:", error);
    
    if (error.message.includes("OpenAI API key not configured")) {
      return res.status(503).json({ 
        message: "AI features are currently unavailable. Please configure the OpenAI API key." 
      });
    }
    
    res.status(500).json({ 
      message: "Failed to improve note",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
