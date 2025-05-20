export interface TutorialCard {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
  section: string;
}

export const tutorials: TutorialCard[] = [
  {
    id: "basic-settings",
    title: "Chat Interface Basic Settings",
    description: "Configure fundamental settings for your chat interface",
    videoUrl: "https://www.loom.com/embed/8627cb64312447cfb2ff114258b6e8b4?sid=79923b73-eb81-43c3-85d0-0e0cb9df41cb",
    thumbnailUrl: "https://example.com/thumbnails/basic-settings.jpg",
    tags: ["settings", "display name", "theme", "footer", "width"],
    section: "Chatbot Styling"
  },
  {
    id: "appearance",
    title: "Chat Interface Appearance",
    description: "Customize the visual appearance of your chat interface",
    videoUrl: "https://www.loom.com/embed/53d2ed33c10b4e28b8cfd4c6991116c7",
    thumbnailUrl: "https://example.com/thumbnails/appearance.jpg",
    tags: ["appearance", "colors", "header", "bubble", "styling"],
    section: "Chatbot Styling"
  },
  {
    id: "behavior",
    title: "Chat Behavior",
    description: "Edit the initial message, add suggested messages, customize the message placeholder, enable user feedback, and allow message regeneration for your chatbot.",
    videoUrl: "https://www.loom.com/embed/2d51e94985384bf5a4bb145540b4db43?sid=dc6fec63-9203-4c33-b862-19a770b9e3c2",
    thumbnailUrl: "https://example.com/thumbnails/behavior.jpg",
    tags: ["behavior", "responses", "interaction", "initial message", "suggested messages", "feedback", "regenerate"],
    section: "Chatbot Styling"
  },
  {
    id: "display-settings",
    title: "Display Settings",
    description: "Align the chat bubble, control the initial message pop-up timing, and set the tooltip message for your chatbot interface.",
    videoUrl: "https://www.loom.com/embed/e92f45fc4aed4d03baa7cb5d913bed71?sid=e3687caa-1c24-4310-babb-452850aea65b",
    thumbnailUrl: "https://example.com/thumbnails/display-settings.jpg",
    tags: ["display", "layout", "alignment", "tooltip", "initial message", "timing"],
    section: "Chatbot Styling"
  },
  {
    id: "media-management",
    title: "Chat Interface Media Management",
    description: "Change the chatbot's profile picture (copy-paste or upload), change the icon, change the background, and control background opacity.",
    videoUrl: "https://www.loom.com/embed/6c16f31067554f4c84751b7726633f26?sid=d13479aa-7cda-4be2-bd6b-a6b8e5e543c5",
    thumbnailUrl: "https://example.com/thumbnails/media-management.jpg",
    tags: ["media", "profile picture", "icon", "background", "opacity", "images", "upload"],
    section: "Chatbot Styling"
  }
]; 