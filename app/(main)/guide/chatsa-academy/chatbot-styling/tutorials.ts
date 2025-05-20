export interface TutorialCard {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
}

export const tutorials: TutorialCard[] = [
  {
    id: "basic-settings",
    title: "Chat Interface Basic Settings",
    description: "Configure fundamental settings for your chat interface",
    videoUrl: "https://www.loom.com/embed/8627cb64312447cfb2ff114258b6e8b4?sid=79923b73-eb81-43c3-85d0-0e0cb9df41cb",
    thumbnailUrl: "https://example.com/thumbnails/basic-settings.jpg",
    tags: ["settings", "display name", "theme", "footer", "width"]
  },
  {
    id: "appearance",
    title: "Chat Interface Appearance",
    description: "Customize the visual appearance of your chat interface",
    videoUrl: "https://www.loom.com/embed/53d2ed33c10b4e28b8cfd4c6991116c7",
    thumbnailUrl: "https://example.com/thumbnails/appearance.jpg",
    tags: ["appearance", "colors", "header", "bubble", "styling"]
  },
  {
    id: "behavior",
    title: "Chat Behavior",
    description: "Adjust how your chat interface behaves and responds",
    videoUrl: "https://example.com/videos/behavior.mp4",
    thumbnailUrl: "https://example.com/thumbnails/behavior.jpg",
    tags: ["behavior", "responses", "interaction"]
  },
  {
    id: "display-settings",
    title: "Display Settings",
    description: "Fine-tune display preferences and layout options",
    videoUrl: "https://example.com/videos/display-settings.mp4",
    thumbnailUrl: "https://example.com/thumbnails/display-settings.jpg",
    tags: ["display", "layout", "preferences"]
  },
  {
    id: "media-management",
    title: "Chat Interface Media Management",
    description: "Manage and customize media elements in your chat interface",
    videoUrl: "https://example.com/videos/media-management.mp4",
    thumbnailUrl: "https://example.com/thumbnails/media-management.jpg",
    tags: ["media", "images", "videos", "management"]
  }
]; 