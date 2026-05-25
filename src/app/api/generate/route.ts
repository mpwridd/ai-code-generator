import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || !language) {
      return NextResponse.json(
        { error: 'Prompt and language are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.MIMO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MIMO_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert ${language} developer. When given a code generation request, you MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) with exactly two keys:
- "code": the complete, production-ready ${language} code
- "explanation": a detailed explanation of the code, how it works, key concepts, and usage examples

Make the code clean, well-commented, and following best practices for ${language}.
The explanation should be comprehensive but easy to understand.

IMPORTANT: Your entire response must be parseable as JSON. Do not include any text before or after the JSON object.`;

    const response = await fetch('http://100.91.112.121:8317/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Mimo-V2.5-Pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mimo API error:', errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI model' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsed;
    try {
      // Try to parse directly
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code fences
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to find JSON object in the content
        const jsonObjectMatch = content.match(/\{[\s\S]*"code"[\s\S]*"explanation"[\s\S]*\}/);
        if (jsonObjectMatch) {
          parsed = JSON.parse(jsonObjectMatch[0]);
        } else {
          // Fallback: treat entire content as code
          parsed = {
            code: content,
            explanation: 'Code generated successfully. The AI did not provide a separate explanation.',
          };
        }
      }
    }

    return NextResponse.json({
      code: parsed.code || content,
      explanation: parsed.explanation || 'No explanation provided.',
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
