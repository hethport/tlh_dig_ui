export interface InscribedLetter {
  content: string;
}

export function inscribedLetter(content: string): InscribedLetter {
  return {content};
}