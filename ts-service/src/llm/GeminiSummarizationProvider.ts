import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CandidateSummaryInput,
  CandidateSummaryResult,
  SummarizationProvider,
} from './summarization-provider.interface';

@Injectable()
export class GeminiSummarizationProvider implements SummarizationProvider {

  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private readonly logger = new Logger(GeminiSummarizationProvider.name);

  async generateCandidateSummary(
    input: CandidateSummaryInput,
  ): Promise<CandidateSummaryResult> {

    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    //redefined the prompt for model result accuracy
    const prompt = `
    You are an AI assistant helping recruiters evaluate candidates.

    You will receive one or more documents belonging to a candidate (resume, CV, etc).

    Your task is to analyze the documents and produce a structured evaluation.

    Return ONLY valid JSON. 
    Do NOT include explanations.
    Do NOT include markdown.
    Do NOT wrap the JSON in code blocks.
    Do NOT include any text before or after the JSON.

    The JSON MUST follow this exact schema:

    {
      "score": number, 
      "strengths": string[],
      "concerns": string[],
      "summary": string,
      "recommendedDecision": "advance" | "hold" | "reject"
    }

    Rules:

    score:
    - integer between 0 and 100
    - represents overall candidate quality

    strengths:
    - list 2–5 key strengths found in the documents

    concerns:
    - list potential concerns or missing information

    summary:
    - concise professional summary (3–5 sentences)

    recommendedDecision:
    - advance → strong candidate
    - hold → potential but needs more evaluation
    - reject → insufficient qualifications

    Candidate ID:
    ${input.candidateId}

    Candidate Documents:
    ${input.documents.join("\n\n---DOCUMENT---\n\n")}
    `;

    const result = await model.generateContent(prompt);
    const text = this.cleanLLMResponse(result.response.text())

    let parsed: CandidateSummaryResult; //structure LLM output

    try {
      parsed = JSON.parse(text);
    } catch(error) {
      this.logger.error('Invalid JSON returned by LLM', error);
      throw new Error("Invalid JSON returned by LLM");
    }
    this.logger.log(`Summary generated successfully for candidate ${input.candidateId}`);
    return parsed
  }

  cleanLLMResponse = (text: string) => {
    return text.replace(/```json|```/g, "").trim();
  }
}