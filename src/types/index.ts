export interface CodeHistory {
  id: string;
  prompt: string;
  language: string;
  code: string;
  explanation: string;
  timestamp: Date;
}

export interface GenerateRequest {
  prompt: string;
  language: string;
}

export interface GenerateResponse {
  code: string;
  explanation: string;
}

export type SupportedLanguage = 
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'rust'
  | 'go'
  | 'solidity';

export const SUPPORTED_LANGUAGES: { value: SupportedLanguage; label: string; icon: string }[] = [
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '📘' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'solidity', label: 'Solidity', icon: '⟠' },
];

export const LANGUAGE_EXTENSIONS: Record<SupportedLanguage, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  rust: 'rust',
  go: 'go',
  solidity: 'solidity',
};
