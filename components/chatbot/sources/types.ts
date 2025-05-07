export interface YouTubeLink {
  id: string;
  link: string;
  chars: number;
  trieveId?: string,
  transcript?: string;
  status?: "pending" | "processing" | "transcripted" | "trained" | "error";
  transcriptionResultUrl?: string;
}
