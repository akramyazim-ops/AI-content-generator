import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { formData, imageBase64 } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }
    
    // Initialize Gemini here so it catches the runtime value
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const {
      businessType,
      productName,
      keyBenefits,
      targetAudience,
      contentType,
      tone,
    } = formData;

    let imageDescription = "";

    // Step 1: If there's an image, analyze it using Gemini Vision
    if (imageBase64) {
      try {
        const visionModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        const prompt = "Describe this product image in detail for marketing purposes. Include product type, key features, style, and target audience.";
        
        // Remove the data:image/jpeg;base64, prefix if it exists
        const base64Data = imageBase64.split(",")[1] || imageBase64;
        
        const imageParts = [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, can be dynamic
            },
          },
        ];

        const visionResult = await visionModel.generateContent([prompt, ...imageParts]);
        const visionResponse = await visionResult.response;
        imageDescription = visionResponse.text();
      } catch (imgError) {
        console.error("Vision Error:", imgError);
        // Continue without image description if vision fails, or handle it
        imageDescription = "Image analysis failed.";
      }
    }

    // Step 2: Generate Content
    const textModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const generationPrompt = `You are a Malaysian social media marketing expert.
    
Create a high-converting ${contentType} in Bahasa Melayu (rojak style).

Business Type: ${businessType}
Product Name: ${productName}
Key Benefits: ${keyBenefits}
Target Audience: ${targetAudience}

${imageDescription ? `Product Image Description:\n${imageDescription}\n` : ""}

Format:
1. Hook (scroll-stopping)
2. Story (relatable, emotional)
3. CTA (clear action)

Make it engaging, natural, and suitable for Malaysian audience. Don't be too robotic. Use suitable emojis.`;

    const result = await textModel.generateContent(generationPrompt);
    const response = await result.response;
    const generatedText = response.text();

    return NextResponse.json({ content: generatedText });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. " + (error.message || "") },
      { status: 500 }
    );
  }
}
