// Text cleaning utilities
/*
function cleanText(text: string): string {
    return text
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove multiple newlines
      .replace(/\n{2,}/g, '\n')
      // Remove special characters except basic punctuation
      .replace(/[^\w\s.,!?-]/g, '')
      // Fix spacing around punctuation
      .replace(/\s+([.,!?])/g, '$1')
      // Remove duplicate punctuation
      .replace(/([.,!?])+/g, '$1')
      // Ensure proper sentence spacing
      .replace(/([.,!?])(\w)/g, '$1 $2')
      .trim();
  }
  
  // Split text into sentences
  function splitIntoSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+/g) || [];
  }
  
  // Calculate word frequencies
  function calculateWordFrequencies(text: string): Map<string, number> {
    const wordFrequency = new Map<string, number>();
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    words.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
    
    return wordFrequency;
  }
  
  // Score sentences based on word frequency
  function scoreSentences(sentences: string[], wordFrequency: Map<string, number>): Array<{ sentence: string; score: number }> {
    return sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const score = sentenceWords.reduce((acc, word) => acc + (wordFrequency.get(word) || 0), 0);
      return { sentence, score: score / sentenceWords.length };
    });
  }
  
  // Extractive text summarization
  export function summarizeText(text: string, sentenceCount: number = 5): string {
    if (!text.trim()) return '';
  
    const cleanedText = cleanText(text);
    const sentences = splitIntoSentences(cleanedText);
    
    if (sentences.length <= sentenceCount) return cleanedText;
  
    const wordFrequency = calculateWordFrequencies(cleanedText);
    const sentenceScores = scoreSentences(sentences, wordFrequency);
  
    // Get top N sentences while maintaining original order
    const topSentences = [...sentenceScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, sentenceCount)
      .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
      .map(item => item.sentence);
  
    return topSentences.join(' ').trim();
  }
*/
export interface ProcessedText {
  cleanText: string;
  cleaned: string;
  summary: string;
  wordCount: number;
  readingTime: number;
}

export async function cleanText(text: string): Promise<string> {
  // Remove extra whitespace and normalize line breaks
  let cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/[\r\n]+/g, '\n')
    .trim();
  
  // Remove common PDF artifacts
  cleaned = cleaned
    .replace(/Page \d+/g, '')  // Remove page numbers
    .replace(/^\s*\d+\s*$/gm, '')  // Remove standalone numbers
    .replace(/[^\S\n]+/g, ' ');  // Normalize spaces but keep newlines
    
  return cleaned;
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}