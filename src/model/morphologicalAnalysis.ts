// regex means multiple whitespaces followed by (but not including) an opening curly brace
const analysesSplitRegex = /\s+(?={)/;

export interface AnalysisOption {
  type: 'AnalysisOption';
  letter: string;
  analysis: string;
}

function parseAnalysisOption(as: string): AnalysisOption {
  const [letter, analysis, ..._] = as
    // Remove curly braces
    .substr(1, as.length - 2)
    .split('→')
    .map((s) => s.trim());

  return {type: 'AnalysisOption', letter, analysis};
}

function parseAnalysis(as: string): string | AnalysisOption[] {
  if (as.includes('{')) {
    return as.split(analysesSplitRegex).map(parseAnalysisOption);
  } else {
    return as;
  }
}

export interface MorphologicalAnalysis {
  type: 'MorphAnalysis';
  transcription: string;
  translation: string;
  analyses: string | AnalysisOption[];
  other: string[];
}

export function morphologicalAnalysis(content: string): MorphologicalAnalysis {
  const [
    transcription,
    translation,
    analysesString,
    ...other
  ] = content.split("@").map((s) => s.trim());

  const analyses = parseAnalysis(analysesString);

  return {type: 'MorphAnalysis', translation, transcription, analyses, other};
}