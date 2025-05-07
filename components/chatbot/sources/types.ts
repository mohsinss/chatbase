export interface YouTubeLink {
  id: string;
  link: string;
  chars: number;
  transcript?: string;
  status?: "pending" | "transcripting" | "transcripted" | "trained" | "error";
  transcriptionResultUrl?: string;
}
