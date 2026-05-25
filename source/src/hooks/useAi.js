import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export function useAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getApiKey = () => {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  };
  const getApiModel = () => {
    return import.meta.env.VITE_GEMINI_API_MODEL || 'gemini-2.5-flash';
  };

  // Local fallback parsing logic using advanced keyword and regex rules
  const localParseQuery = (query) => {
    const q = query.toLowerCase();

    // Initializing structure
    const filters = {
      city: null,
      type: null,
      maxPrice: null,
      minRating: null,
      minBeds: null,
      amenities: []
    };

    // 1. City Parsing
    if (q.includes('hanoi') || q.includes('hà nội') || q.includes('ba dinh') || q.includes('tay ho') || q.includes('hoan kiem') || q.includes('dong da')) {
      filters.city = 'Hanoi';
    } else if (q.includes('ho chi minh') || q.includes('hcmc') || q.includes('saigon') || q.includes('sài gòn') || q.includes('thao dien') || q.includes('district 1') || q.includes('district 2') || q.includes('district 3')) {
      filters.city = 'Ho Chi Minh City';
    } else if (q.includes('da nang') || q.includes('đà nẵng') || q.includes('son tra') || q.includes('hai chau') || q.includes('my khe')) {
      filters.city = 'Da Nang';
    }

    // 2. Type Parsing
    if (q.includes('studio') || q.includes('room')) {
      filters.type = 'Studio';
    } else if (q.includes('apartment') || q.includes('condo') || q.includes('flat') || q.includes('penthouse')) {
      filters.type = 'Apartment';
    } else if (q.includes('house') || q.includes('villa') || q.includes('townhouse')) {
      filters.type = 'House';
    }

    // 3. Price Parsing
    // Look for patterns like "under $50", "below 100", "less than 60", "max 80"
    const priceRegexes = [
      /under\s*\$?(\d+)/,
      /below\s*\$?(\d+)/,
      /less\s*than\s*\$?(\d+)/,
      /max(?:imum)?\s*\$?(\d+)/,
      /budget\s*of\s*\$?(\d+)/,
      /\$?(\d+)\s*or\s*less/
    ];

    for (let regex of priceRegexes) {
      const match = q.match(regex);
      if (match && match[1]) {
        filters.maxPrice = parseInt(match[1]);
        break;
      }
    }

    // Special keywords for pricing
    if (!filters.maxPrice) {
      if (q.includes('cheap') || q.includes('budget') || q.includes('pocket-friendly') || q.includes('affordable')) {
        filters.maxPrice = 45;
      }
    }

    // 4. Rating Parsing
    if (q.includes('top rated') || q.includes('best') || q.includes('popular') || q.includes('highly rated')) {
      filters.minRating = 4.8;
    }

    // 5. Bedroom Parsing
    const bedMatch = q.match(/(\d+)\s*bed/);
    if (bedMatch && bedMatch[1]) {
      filters.minBeds = parseInt(bedMatch[1]);
    }

    // 6. Amenities Parsing
    const amenityMap = {
      'wifi': 'Wi-Fi',
      'wi-fi': 'Wi-Fi',
      'internet': 'Wi-Fi',
      'workspace': 'Workspace',
      'desk': 'Workspace',
      'work': 'Workspace',
      'pool': 'Pool',
      'swim': 'Pool',
      'gym': 'Gym',
      'fitness': 'Gym',
      'garden': 'Garden',
      'yard': 'Garden',
      'kitchen': 'Kitchen',
      'cook': 'Kitchen',
      'elevator': 'Elevator',
      'lift': 'Elevator',
      'wash': 'Washing Machine',
      'laundry': 'Washing Machine',
      'security': 'Security',
      'safe': 'Security',
      'balcony': 'Balcony',
      'terrace': 'Balcony'
    };

    Object.keys(amenityMap).forEach(key => {
      if (q.includes(key)) {
        const val = amenityMap[key];
        if (!filters.amenities.includes(val)) {
          filters.amenities.push(val);
        }
      }
    });

    // Create a local conversational response summary
    let localResponse = "Hello! I parsed your query locally. ";
    if (filters.city) {
      localResponse += `I'm filtering for listings in **${filters.city}**. `;
      if (filters.city === 'Hanoi') {
        localResponse += `Hanoi's neighborhoods (like Tay Ho for lakes, Ba Dinh for culture, and Hoan Kiem for dining) offer unique vibes. `;
      } else if (filters.city === 'Ho Chi Minh City') {
        localResponse += `Ho Chi Minh City is extremely dynamic. District 1 is bustling, and Thao Dien (D2) is popular with expats and remote workers. `;
      } else if (filters.city === 'Da Nang') {
        localResponse += `Da Nang offers a fantastic blend of beach life in Son Tra and city features in Hai Chau. `;
      }
    }

    if (filters.type) {
      localResponse += `Searching specifically for **${filters.type}s**. `;
    }
    if (filters.maxPrice) {
      localResponse += `Setting a maximum budget of **$${filters.maxPrice} per night**. `;
    }
    if (filters.amenities.length > 0) {
      localResponse += `Matching amenities: **${filters.amenities.join(', ')}**. `;
    }

    localResponse += "\n\nI have filtered the properties on your screen. You can review them on the map and grid.";

    return {
      filters,
      response: localResponse
    };
  };

  // Perform Gemini query parsing if API Key is available
  const parseWithGemini = async (query, apiKey) => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-2.5-flash as it is highly responsive and standard
      const model = genAI.getGenerativeModel({
        model: getApiModel(),
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const systemInstruction = `
        You are NestFind AI, an intelligent booking and neighborhood advisor for rental properties in Vietnam.
        Your task is to analyze the user's natural language request, extract structural search filters, and answer conversational queries.
        
        The listings database contains listings in:
        - Cities: "Hanoi", "Ho Chi Minh City", "Da Nang"
        - Room Types: "Studio", "Apartment", "House"
        - Amenities: "Wi-Fi", "Workspace", "Pool", "Gym", "Garden", "Kitchen", "Elevator", "Washing Machine", "Security", "Balcony"
        
        You must return a JSON response matching the following typescript schema:
        {
          filters: {
            city: "Hanoi" | "Ho Chi Minh City" | "Da Nang" | null;
            type: "Studio" | "Apartment" | "House" | null;
            maxPrice: number | null;
            minRating: number | null;
            minBeds: number | null;
            amenities: string[]; // matching the list of valid amenities above
          };
          response: string; // A natural, warm, and professional response explaining the matches. Include local neighborhood highlights (e.g. West Lake, Dragon Bridge, District 1/Thao Dien hubs) matching the location queried. Keep it under 4 sentences.
        }
      `;

      const prompt = `
        System Instruction: ${systemInstruction}
        
        User Query: "${query}"
        
        Provide the JSON output now.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (err) {
      console.error("Gemini API Error, falling back to local parsing:", err);

      // Attempt to query the list of available models to help developer debug
      if (apiKey) {
        fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
          .then(res => res.json())
          .then(data => {
            if (data.models) {
              console.log("Active models available for your API key:", data.models.map(m => m.name));
            } else {
              console.log("Model check response:", data);
            }
          })
          .catch(e => console.error("Failed to query available models:", e));
      }

      // Fallback if parsing fails or invalid API key
      return localParseQuery(query);
    }
  };

  const askAi = async (query) => {
    if (!query || !query.trim()) return null;

    setLoading(true);
    setError(null);

    const key = getApiKey();
    try {
      let result;
      if (key) {
        result = await parseWithGemini(query, key);
      } else {
        // Sleep to simulate network delay for mock purposes
        await new Promise(resolve => setTimeout(resolve, 800));
        result = localParseQuery(query);
      }
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred while speaking to the AI.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { askAi, loading, error };
}
