"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandInstagram, IconPlus, IconTrash, IconAlertTriangle, IconTestPipe, IconPhoto, IconVideo, IconUsers, IconHeart, IconMessageCircle, IconStar, IconGift, IconTrendingUp, IconShoppingCart, IconMapPin, IconCalendar, IconBulb, IconPaperclip, IconFileText, IconX, IconUpload, IconEye, IconUserPlus, IconBrandTiktok } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

interface InstagramReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
}

interface KeywordTrigger {
  keyword: string;
  prompt: string;
  delay: number;
  attachments?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  size: number;
}

interface SettingsData {
  // Original reactions - keeping these
  commentDmEnabled: boolean;
  commentDmPrompt: string;
  commentDmDelay: number;
  storyReactionEnabled: boolean;
  storyReactionPrompt: string;
  storyReactionDelay: number;
  keywordDmEnabled: boolean;
  keywordTriggers: KeywordTrigger[];
  likeDmEnabled: boolean;
  likeDmPrompt: string;
  likeDmDelay: number;
  likeDmFirstOnly: boolean;
  likeDmSpecificPosts: { postUrl: string; prompt: string; delay: number }[];
  followDmEnabled: boolean;
  followDmPrompt: string;
  followDmDelay: number;
  
  // Instagram Influencer Outreach
  influencerOutreachEnabled: boolean;
  influencerKeywords: KeywordTrigger[];
  influencerPrompt: string;
  influencerDelay: number;
  influencerAttachments: FileAttachment[];
  
  // UGC Content Collection
  ugcCollectionEnabled: boolean;
  ugcKeywords: KeywordTrigger[];
  ugcPrompt: string;
  ugcDelay: number;
  ugcAttachments: FileAttachment[];
  
  // Instagram Shopping Assistant
  shoppingAssistantEnabled: boolean;
  shoppingKeywords: KeywordTrigger[];
  shoppingPrompt: string;
  shoppingDelay: number;
  shoppingAttachments: FileAttachment[];
  
  // Story Poll/Quiz Engagement
  storyEngagementEnabled: boolean;
  storyEngagementKeywords: KeywordTrigger[];
  storyEngagementPrompt: string;
  storyEngagementDelay: number;
  storyEngagementAttachments: FileAttachment[];
  
  // Reels Viral Boost
  reelsBoostEnabled: boolean;
  reelsKeywords: KeywordTrigger[];
  reelsPrompt: string;
  reelsDelay: number;
  reelsAttachments: FileAttachment[];
  
  // Brand Ambassador Recruitment
  ambassadorRecruitmentEnabled: boolean;
  ambassadorKeywords: KeywordTrigger[];
  ambassadorPrompt: string;
  ambassadorDelay: number;
  ambassadorAttachments: FileAttachment[];
  
  // Instagram Live Engagement
  liveEngagementEnabled: boolean;
  liveKeywords: KeywordTrigger[];
  livePrompt: string;
  liveDelay: number;
  liveAttachments: FileAttachment[];
  
  // Hashtag Campaign Management
  hashtagCampaignEnabled: boolean;
  hashtagKeywords: KeywordTrigger[];
  hashtagPrompt: string;
  hashtagDelay: number;
  hashtagAttachments: FileAttachment[];
  
  // Instagram Contest Automation
  contestAutomationEnabled: boolean;
  contestKeywords: KeywordTrigger[];
  contestPrompt: string;
  contestDelay: number;
  contestAttachments: FileAttachment[];
  
  // Micro-Influencer Discovery
  microInfluencerEnabled: boolean;
  microInfluencerKeywords: KeywordTrigger[];
  microInfluencerPrompt: string;
  microInfluencerDelay: number;
  microInfluencerAttachments: FileAttachment[];
  
  // AI Detection toggles for each automation
  influencerOutreachAiEnabled: boolean;
  ugcCollectionAiEnabled: boolean;
  shoppingAssistantAiEnabled: boolean;
  storyEngagementAiEnabled: boolean;
  reelsBoostAiEnabled: boolean;
  ambassadorRecruitmentAiEnabled: boolean;
  liveEngagementAiEnabled: boolean;
  hashtagCampaignAiEnabled: boolean;
  contestAutomationAiEnabled: boolean;
  microInfluencerAiEnabled: boolean;
  
  // Allow dynamic property access
  [key: string]: any;
}

const InstagramReactions = ({ chatbot }: InstagramReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    // Original reactions - keeping these
    commentDmEnabled: false,
    commentDmPrompt: "Thanks for your comment! I'd love to continue this conversation in DMs.",
    commentDmDelay: 0,
    storyReactionEnabled: false,
    storyReactionPrompt: "Thanks for reacting to my story! What did you think about it?",
    storyReactionDelay: 0,
    keywordDmEnabled: false,
    keywordTriggers: [],
    likeDmEnabled: false,
    likeDmPrompt: "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?",
    likeDmDelay: 0,
    likeDmFirstOnly: false,
    likeDmSpecificPosts: [],
    followDmEnabled: false,
    followDmPrompt: "Thanks for following us! We're excited to connect with you. How can we help?",
    followDmDelay: 0,
    
    // Instagram Influencer Outreach
    influencerOutreachEnabled: false,
    influencerKeywords: [],
    influencerPrompt: "🌟 Love your content! We'd love to collaborate with you. Check your DMs for partnership details!",
    influencerDelay: 2,
    influencerAttachments: [],
    
    // UGC Content Collection
    ugcCollectionEnabled: false,
    ugcKeywords: [],
    ugcPrompt: "📸 Amazing content! We'd love to feature you on our page. Can we repost this with credit?",
    ugcDelay: 1,
    ugcAttachments: [],
    
    // Instagram Shopping Assistant
    shoppingAssistantEnabled: false,
    shoppingKeywords: [],
    shoppingPrompt: "🛍️ Interested in this product? Here's the direct link to purchase + exclusive discount code!",
    shoppingDelay: 1,
    shoppingAttachments: [],
    
    // Story Poll/Quiz Engagement
    storyEngagementEnabled: false,
    storyEngagementKeywords: [],
    storyEngagementPrompt: "🎯 Thanks for participating in our story! Here's your personalized result and special offer:",
    storyEngagementDelay: 0,
    storyEngagementAttachments: [],
    
    // Reels Viral Boost
    reelsBoostEnabled: false,
    reelsKeywords: [],
    reelsPrompt: "🔥 Your Reel is amazing! Want to boost its reach? Here's how we can help make it go viral:",
    reelsDelay: 3,
    reelsAttachments: [],
    
    // Brand Ambassador Recruitment
    ambassadorRecruitmentEnabled: false,
    ambassadorKeywords: [],
    ambassadorPrompt: "👑 We love your vibe! Interested in becoming a brand ambassador? Here's our exclusive program:",
    ambassadorDelay: 2,
    ambassadorAttachments: [],
    
    // Instagram Live Engagement
    liveEngagementEnabled: false,
    liveKeywords: [],
    livePrompt: "🔴 Thanks for joining our Live! Here's the exclusive content/offer we mentioned:",
    liveDelay: 1,
    liveAttachments: [],
    
    // Hashtag Campaign Management
    hashtagCampaignEnabled: false,
    hashtagKeywords: [],
    hashtagPrompt: "🏷️ Thanks for using our hashtag! You're entered in our campaign. Here are the details:",
    hashtagDelay: 2,
    hashtagAttachments: [],
    
    // Instagram Contest Automation
    contestAutomationEnabled: false,
    contestKeywords: [],
    contestPrompt: "🎉 Contest entry confirmed! Here are the rules, prizes, and how to increase your chances:",
    contestDelay: 1,
    contestAttachments: [],
    
    // Micro-Influencer Discovery
    microInfluencerEnabled: false,
    microInfluencerKeywords: [],
    microInfluencerPrompt: "✨ We discovered your amazing content! Interested in paid collaborations? Here's our creator program:",
    microInfluencerDelay: 3,
    microInfluencerAttachments: [],
    
    // AI Detection toggles for each automation
    influencerOutreachAiEnabled: false,
    ugcCollectionAiEnabled: false,
    shoppingAssistantAiEnabled: false,
    storyEngagementAiEnabled: false,
    reelsBoostAiEnabled: false,
    ambassadorRecruitmentAiEnabled: false,
    liveEngagementAiEnabled: false,
    hashtagCampaignAiEnabled: false,
    contestAutomationAiEnabled: false,
    microInfluencerAiEnabled: false
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        // Original reactions test data
        commentDmEnabled: true,
        storyReactionEnabled: true,
        keywordDmEnabled: true,
        keywordTriggers: [
          { keyword: "collab", prompt: "Let's collaborate! I'll send you our partnership details.", delay: 2 },
          { keyword: "price", prompt: "Here's our current pricing and special Instagram discount!", delay: 1 }
        ],
        likeDmEnabled: true,
        followDmEnabled: true,
        
        // New automations test data
        influencerOutreachEnabled: true,
        influencerKeywords: [
          { keyword: "influencer", prompt: "🌟 Perfect! Here's our influencer partnership package with rates and perks!", delay: 2 },
          { keyword: "collab", prompt: "💫 Let's create something amazing together! Check out our collaboration terms:", delay: 1 }
        ],
        ugcCollectionEnabled: true,
        ugcKeywords: [
          { keyword: "repost", prompt: "📸 Absolutely! We'd love to feature your content. Here's our UGC agreement:", delay: 1 }
        ],
        shoppingAssistantEnabled: true,
        shoppingKeywords: [
          { keyword: "buy", prompt: "🛍️ Here's your direct purchase link + 15% off with code INSTA15!", delay: 1 }
        ],
        storyEngagementEnabled: true,
        reelsBoostEnabled: true,
        ambassadorRecruitmentEnabled: true,
        liveEngagementEnabled: true,
        hashtagCampaignEnabled: true,
        contestAutomationEnabled: true,
        microInfluencerEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Instagram:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const addKeywordTrigger = (field: string) => {
    setSettingsData({
      ...settingsData,
      [field]: [...(settingsData[field] || []), { keyword: "", prompt: "", delay: 0 }]
    });
  };

  const removeKeywordTrigger = (field: string, index: number) => {
    const newTriggers = [...(settingsData[field] || [])];
    newTriggers.splice(index, 1);
    setSettingsData({ ...settingsData, [field]: newTriggers });
  };

  const updateKeywordTrigger = (field: string, index: number, property: string, value: any) => {
    const newTriggers = [...(settingsData[field] || [])];
    newTriggers[index][property] = value;
    setSettingsData({ ...settingsData, [field]: newTriggers });
  };

  const addSpecificPost = () => {
    setSettingsData({
      ...settingsData,
      likeDmSpecificPosts: [...(settingsData.likeDmSpecificPosts || []), { postUrl: "", prompt: "", delay: 0 }]
    });
  };

  const removeSpecificPost = (index: number) => {
    const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
    newPosts.splice(index, 1);
    setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
  };

  // Original reaction sections - restyled to match new design
  const originalReactionSections = [
    {
      id: 'commentDm',
      title: 'Comment-Triggered DMs',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Send automated DMs when users comment on your posts',
      enabled: settingsData.commentDmEnabled,
      color: 'purple',
      hasSubSettings: true
    },
    {
      id: 'storyReaction',
      title: 'Story Reactions',
      icon: <IconEye className="w-5 h-5" />,
      description: 'Respond to story reactions and interactions',
      enabled: settingsData.storyReactionEnabled,
      color: 'pink',
      hasSubSettings: true
    },
    {
      id: 'keywordDm',
      title: 'Keyword-Triggered DMs',
      icon: <IconBulb className="w-5 h-5" />,
      description: 'Trigger specific responses based on comment keywords',
      enabled: settingsData.keywordDmEnabled,
      keywords: settingsData.keywordTriggers,
      color: 'indigo',
      hasKeywords: true
    },
    {
      id: 'likeDm',
      title: 'Like DMs',
      icon: <IconHeart className="w-5 h-5" />,
      description: 'Send DMs when users like your posts',
      enabled: settingsData.likeDmEnabled,
      color: 'rose',
      hasSpecificPosts: true,
      specificPosts: settingsData.likeDmSpecificPosts,
      prompt: settingsData.likeDmPrompt,
      delay: settingsData.likeDmDelay,
      firstOnly: settingsData.likeDmFirstOnly
    },
    {
      id: 'followDm',
      title: 'Follow DMs',
      icon: <IconUserPlus className="w-5 h-5" />,
      description: 'Welcome new followers with automated messages',
      enabled: settingsData.followDmEnabled,
      color: 'blue',
      hasSubSettings: true
    }
  ];

  const reactionSections = [
    {
      id: 'influencerOutreach',
      title: 'Influencer Outreach Automation',
      icon: <IconStar className="w-5 h-5" />,
      description: 'Auto-identify and reach out to potential influencer partners',
      enabled: settingsData.influencerOutreachEnabled,
      keywords: settingsData.influencerKeywords,
      prompt: settingsData.influencerPrompt,
      delay: settingsData.influencerDelay,
      color: 'yellow'
    },
    {
      id: 'ugcCollection',
      title: 'UGC Content Collection',
      icon: <IconPhoto className="w-5 h-5" />,
      description: 'Auto-request user-generated content and repost permissions',
      enabled: settingsData.ugcCollectionEnabled,
      keywords: settingsData.ugcKeywords,
      prompt: settingsData.ugcPrompt,
      delay: settingsData.ugcDelay,
      color: 'green'
    },
    {
      id: 'shoppingAssistant',
      title: 'Instagram Shopping Assistant',
      icon: <IconShoppingCart className="w-5 h-5" />,
      description: 'Auto-send product links and shopping assistance',
      enabled: settingsData.shoppingAssistantEnabled,
      keywords: settingsData.shoppingKeywords,
      prompt: settingsData.shoppingPrompt,
      delay: settingsData.shoppingDelay,
      color: 'blue'
    },
    {
      id: 'storyEngagement',
      title: 'Story Poll/Quiz Engagement',
      icon: <IconTrendingUp className="w-5 h-5" />,
      description: 'Auto-respond to story polls, quizzes, and interactions',
      enabled: settingsData.storyEngagementEnabled,
      keywords: settingsData.storyEngagementKeywords,
      prompt: settingsData.storyEngagementPrompt,
      delay: settingsData.storyEngagementDelay,
      color: 'purple'
    },
    {
      id: 'reelsBoost',
      title: 'Reels Viral Boost',
      icon: <IconVideo className="w-5 h-5" />,
      description: 'Auto-engage with high-potential Reels for viral growth',
      enabled: settingsData.reelsBoostEnabled,
      keywords: settingsData.reelsKeywords,
      prompt: settingsData.reelsPrompt,
      delay: settingsData.reelsDelay,
      color: 'red'
    },
    {
      id: 'ambassadorRecruitment',
      title: 'Brand Ambassador Recruitment',
      icon: <IconUsers className="w-5 h-5" />,
      description: 'Auto-recruit engaged users as brand ambassadors',
      enabled: settingsData.ambassadorRecruitmentEnabled,
      keywords: settingsData.ambassadorKeywords,
      prompt: settingsData.ambassadorPrompt,
      delay: settingsData.ambassadorDelay,
      color: 'indigo'
    },
    {
      id: 'liveEngagement',
      title: 'Instagram Live Engagement',
      icon: <IconEye className="w-5 h-5" />,
      description: 'Auto-follow up with Live stream participants',
      enabled: settingsData.liveEngagementEnabled,
      keywords: settingsData.liveKeywords,
      prompt: settingsData.livePrompt,
      delay: settingsData.liveDelay,
      color: 'orange'
    },
    {
      id: 'hashtagCampaign',
      title: 'Hashtag Campaign Management',
      icon: <IconTrendingUp className="w-5 h-5" />,
      description: 'Auto-manage hashtag campaigns and track participation',
      enabled: settingsData.hashtagCampaignEnabled,
      keywords: settingsData.hashtagKeywords,
      prompt: settingsData.hashtagPrompt,
      delay: settingsData.hashtagDelay,
      color: 'teal'
    },
    {
      id: 'contestAutomation',
      title: 'Instagram Contest Automation',
      icon: <IconGift className="w-5 h-5" />,
      description: 'Auto-manage contest entries and winner selection',
      enabled: settingsData.contestAutomationEnabled,
      keywords: settingsData.contestKeywords,
      prompt: settingsData.contestPrompt,
      delay: settingsData.contestDelay,
      color: 'pink'
    },
    {
      id: 'microInfluencer',
      title: 'Micro-Influencer Discovery',
      icon: <IconBrandTiktok className="w-5 h-5" />,
      description: 'Auto-discover and recruit micro-influencers in your niche',
      enabled: settingsData.microInfluencerEnabled,
      keywords: settingsData.microInfluencerKeywords,
      prompt: settingsData.microInfluencerPrompt,
      delay: settingsData.microInfluencerDelay,
      color: 'rose'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string; switch: string; focus: string } } = {
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', switch: 'bg-purple-500', focus: 'focus:ring-purple-500 focus:border-purple-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', switch: 'bg-pink-500', focus: 'focus:ring-pink-500 focus:border-pink-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', switch: 'bg-blue-500', focus: 'focus:ring-blue-500 focus:border-blue-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', switch: 'bg-green-500', focus: 'focus:ring-green-500 focus:border-green-500' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', switch: 'bg-red-500', focus: 'focus:ring-red-500 focus:border-red-500' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', switch: 'bg-yellow-500', focus: 'focus:ring-yellow-500 focus:border-yellow-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', switch: 'bg-indigo-500', focus: 'focus:ring-indigo-500 focus:border-indigo-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', switch: 'bg-orange-500', focus: 'focus:ring-orange-500 focus:border-orange-500' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', switch: 'bg-teal-500', focus: 'focus:ring-teal-500 focus:border-teal-500' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', switch: 'bg-rose-500', focus: 'focus:ring-rose-500 focus:border-rose-500' }
    };
    return colors[color] || colors.purple;
  };

  const getDefaultPromptPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      influencerOutreach: "🌟 Love your content! We'd love to collaborate with you. Check your DMs for partnership details!",
      ugcCollection: "📸 Amazing content! We'd love to feature you on our page. Can we repost this with credit?",
      shoppingAssistant: "🛍️ Interested in this product? Here's the direct link to purchase + exclusive discount code!",
      storyEngagement: "🎯 Thanks for participating in our story! Here's your personalized result and special offer:",
      reelsBoost: "🔥 Your Reel is amazing! Want to boost its reach? Here's how we can help make it go viral:",
      ambassadorRecruitment: "👑 We love your vibe! Interested in becoming a brand ambassador? Here's our exclusive program:",
      liveEngagement: "🔴 Thanks for joining our Live! Here's the exclusive content/offer we mentioned:",
      hashtagCampaign: "🏷️ Thanks for using our hashtag! You're entered in our campaign. Here are the details:",
      contestAutomation: "🎉 Contest entry confirmed! Here are the rules, prizes, and how to increase your chances:",
      microInfluencer: "✨ We discovered your amazing content! Interested in paid collaborations? Here's our creator program:"
    };
    return placeholders[sectionId] || "Enter your default response message...";
  };

  const getKeywordExamples = (sectionId: string) => {
    const examples: { [key: string]: string } = {
      influencerOutreach: '"collab", "partnership", "sponsor", "brand deal", "influencer"',
      ugcCollection: '"repost", "feature", "share", "tag", "credit"',
      shoppingAssistant: '"buy", "purchase", "price", "shop", "link"',
      storyEngagement: '"poll", "quiz", "vote", "answer", "choice"',
      reelsBoost: '"viral", "trending", "boost", "promote", "reach"',
      ambassadorRecruitment: '"ambassador", "represent", "brand rep", "team", "join"',
      liveEngagement: '"live", "stream", "broadcast", "watch", "join"',
      hashtagCampaign: '"hashtag", "campaign", "challenge", "tag", "participate"',
      contestAutomation: '"contest", "giveaway", "enter", "win", "prize"',
      microInfluencer: '"creator", "content", "micro", "nano", "collaborate"'
    };
    return examples[sectionId] || '"keyword1", "keyword2", "phrase"';
  };

  const getKeywordPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      influencerOutreach: "collab",
      ugcCollection: "repost",
      shoppingAssistant: "buy",
      storyEngagement: "poll",
      reelsBoost: "viral",
      ambassadorRecruitment: "ambassador",
      liveEngagement: "live",
      hashtagCampaign: "hashtag",
      contestAutomation: "contest",
      microInfluencer: "creator"
    };
    return placeholders[sectionId] || "keyword";
  };

  // File upload and management functions
  const handleFileUpload = async (files: FileList, field: string) => {
    const newAttachments: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!isValidType) {
        alert(`${file.name} is not a supported file type. Please upload images or PDFs only.`);
        continue;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Please upload files smaller than 10MB.`);
        continue;
      }
      
      // Create file attachment object
      const attachment: FileAttachment = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        url: URL.createObjectURL(file), // In real app, this would be uploaded to server
        size: file.size
      };
      
      newAttachments.push(attachment);
    }
    
    // Add to existing attachments
    const currentAttachments = settingsData[field] || [];
    setSettingsData({
      ...settingsData,
      [field]: [...currentAttachments, ...newAttachments]
    });
  };

  const removeAttachment = (field: string, attachmentId: string) => {
    const currentAttachments = settingsData[field] || [];
    const updatedAttachments = currentAttachments.filter((att: FileAttachment) => att.id !== attachmentId);
    setSettingsData({
      ...settingsData,
      [field]: updatedAttachments
    });
  };

  const addKeywordAttachment = (field: string, keywordIndex: number, files: FileList) => {
    const newAttachments: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!isValidType) continue;
      
      if (file.size > 10 * 1024 * 1024) continue;
      
      const attachment: FileAttachment = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        url: URL.createObjectURL(file),
        size: file.size
      };
      
      newAttachments.push(attachment);
    }
    
    const keywords = [...(settingsData[field] || [])];
    keywords[keywordIndex].attachments = [...(keywords[keywordIndex].attachments || []), ...newAttachments];
    setSettingsData({ ...settingsData, [field]: keywords });
  };

  const removeKeywordAttachment = (field: string, keywordIndex: number, attachmentId: string) => {
    const keywords = [...(settingsData[field] || [])];
    keywords[keywordIndex].attachments = (keywords[keywordIndex].attachments || []).filter((att: FileAttachment) => att.id !== attachmentId);
    setSettingsData({ ...settingsData, [field]: keywords });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">Instagram Not Connected</p>
                <p className="text-xs text-orange-600">Connect your Instagram account to enable these powerful automation features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className={`${testMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <div className="flex items-center gap-1">
                  <IconTestPipe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Test Mode</span>
                </div>
              </div>
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect Instagram"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandInstagram className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">Instagram Growth Automation</h1>
              <p className="mt-1 text-white/80">10 powerful automations to turn Instagram engagement into business growth</p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Connected
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={`p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto ${!canInteract ? 'opacity-60' : ''}`}>
        {/* Original Reactions Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Core Reactions</h2>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Essential</span>
          </div>
          
          {originalReactionSections.map((section) => {
            const colors = getColorClasses(section.color);
            
            return (
              <div key={section.id} className={`bg-white rounded-lg border ${colors.border} overflow-hidden mb-4`}>
                <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={section.enabled}
                        onChange={(enabled) => setSettingsData({ ...settingsData, [`${section.id}Enabled`]: enabled })}
                        disabled={!canInteract}
                        className={`${section.enabled ? colors.switch : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                      >
                        <span className={`${section.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                      </Switch>
                      <div className="flex items-center gap-2">
                        {section.icon}
                        <div>
                          <h3 className={`text-lg font-semibold ${colors.text}`}>{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </div>
                    {section.hasKeywords && (
                      <button
                        onClick={() => addKeywordTrigger('keywordTriggers')}
                        disabled={!section.enabled || !canInteract}
                        className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                      >
                        <IconPlus className="w-4 h-4" />
                        Add Keyword Trigger
                      </button>
                    )}
                    {section.hasSpecificPosts && (
                      <button
                        onClick={() => addSpecificPost()}
                        disabled={!section.enabled || !canInteract}
                        className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                      >
                        <IconPlus className="w-4 h-4" />
                        Add Post
                      </button>
                    )}
                  </div>
                </div>

                <div className={`p-4 space-y-4 ${!section.enabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Comment DM specific settings */}
                  {section.id === 'commentDm' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment DM Template</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                          rows={3}
                          value={settingsData.commentDmPrompt}
                          onChange={(e) => setSettingsData({ ...settingsData, commentDmPrompt: e.target.value })}
                          placeholder="Enter message for comment authors..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.commentDmDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, commentDmDelay: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Story Reaction specific settings */}
                  {section.id === 'storyReaction' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Story Reaction DM Template</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                          rows={3}
                          value={settingsData.storyReactionPrompt}
                          onChange={(e) => setSettingsData({ ...settingsData, storyReactionPrompt: e.target.value })}
                          placeholder="Enter message for story reactions..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.storyReactionDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, storyReactionDelay: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Follow DM specific settings */}
                  {section.id === 'followDm' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Follow DM Template</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                          rows={3}
                          value={settingsData.followDmPrompt}
                          onChange={(e) => setSettingsData({ ...settingsData, followDmPrompt: e.target.value })}
                          placeholder="Enter message for new followers..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.followDmDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, followDmDelay: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Keyword DM specific settings */}
                  {section.id === 'keywordDm' && (
                    <>
                      {(settingsData.keywordTriggers || []).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            {section.icon}
                            <p>No keyword triggers configured. Click "Add Keyword Trigger" to get started.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Keyword Triggers</h4>
                          {(settingsData.keywordTriggers || []).map((trigger, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-700">Keyword Trigger {index + 1}</h5>
                                <button
                                  onClick={() => removeKeywordTrigger('keywordTriggers', index)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <IconTrash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trigger Keyword/Phrase
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={trigger.keyword}
                                    onChange={(e) => {
                                      const newTriggers = [...(settingsData.keywordTriggers || [])];
                                      newTriggers[index].keyword = e.target.value;
                                      setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                    }}
                                    placeholder="collab"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Not case-sensitive</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Response
                                    <span className="text-gray-400">(optional)</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={trigger.prompt}
                                    onChange={(e) => {
                                      const newTriggers = [...(settingsData.keywordTriggers || [])];
                                      newTriggers[index].prompt = e.target.value;
                                      setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                    }}
                                    placeholder="Leave empty to use default response"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Override default response for this keyword</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                                  <input
                                    type="number"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={trigger.delay}
                                    onChange={(e) => {
                                      const newTriggers = [...(settingsData.keywordTriggers || [])];
                                      newTriggers[index].delay = Number(e.target.value);
                                      setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Keyword-specific attachments */}
                              <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="block text-sm font-medium text-gray-700">Keyword-Specific Attachments</label>
                                  <label className={`flex items-center gap-2 px-2 py-1 text-xs ${colors.switch} text-white rounded hover:opacity-90 transition-opacity cursor-pointer`}>
                                    <IconPaperclip className="w-3 h-3" />
                                    Add Files
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*,.pdf"
                                      className="hidden"
                                      onChange={(e) => e.target.files && addKeywordAttachment('keywordTriggers', index, e.target.files)}
                                    />
                                  </label>
                                </div>
                                
                                {/* Keyword attachments list */}
                                {(trigger.attachments || []).length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-600">Files attached to this keyword trigger:</p>
                                    <div className="space-y-1">
                                      {(trigger.attachments || []).map((attachment) => (
                                        <div key={attachment.id} className="flex items-center justify-between bg-gray-100 rounded p-2">
                                          <div className="flex items-center gap-2">
                                            {attachment.type === 'image' ? (
                                              <IconPhoto className="w-4 h-4 text-blue-500" />
                                            ) : (
                                              <IconFileText className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className="text-xs text-gray-700">{attachment.name}</span>
                                            <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                                          </div>
                                          <button
                                            onClick={() => removeKeywordAttachment('keywordTriggers', index, attachment.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                          >
                                            <IconX className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                <p className="text-xs text-gray-500">
                                  💡 <strong>Tip:</strong> Files attached here will be sent instead of default attachments for this keyword
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Like DM specific settings */}
                  {section.id === 'likeDm' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Like DM Template</label>
                          <textarea
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                            rows={3}
                            value={section.prompt}
                            onChange={(e) => setSettingsData({ ...settingsData, likeDmPrompt: e.target.value })}
                            placeholder="Enter default message for likes..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Delay (seconds)</label>
                          <input
                            type="number"
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                            value={section.delay}
                            onChange={(e) => setSettingsData({ ...settingsData, likeDmDelay: Number(e.target.value) })}
                          />
                          <div className="mt-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={section.firstOnly}
                                onChange={(e) => setSettingsData({ ...settingsData, likeDmFirstOnly: e.target.checked })}
                                className={`rounded border-gray-300 ${colors.switch} focus:ring-2 ${colors.focus}`}
                              />
                              <span className="text-sm text-gray-700">Send DM only on first like</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {(section.specificPosts || []).length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Specific Post Settings</h4>
                          {(section.specificPosts || []).map((post, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-700">Post {index + 1}</h5>
                                <button
                                  onClick={() => removeSpecificPost(index)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <IconTrash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Post URL</label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={post.postUrl}
                                    onChange={(e) => {
                                      const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                      newPosts[index].postUrl = e.target.value;
                                      setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                    }}
                                    placeholder="https://instagram.com/..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={post.prompt}
                                    onChange={(e) => {
                                      const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                      newPosts[index].prompt = e.target.value;
                                      setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                    }}
                                    placeholder="Leave empty for default"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Delay</label>
                                  <input
                                    type="number"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={post.delay}
                                    onChange={(e) => {
                                      const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                      newPosts[index].delay = Number(e.target.value);
                                      setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                    }}
                                    placeholder="Leave empty for default"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Advanced Instagram Automations Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Advanced Instagram Automations</h2>
            <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full">Premium</span>
          </div>
          
          {reactionSections.map((section) => {
            const colors = getColorClasses(section.color);
            const fieldName = `${section.id}Keywords`;
            const enabledField = `${section.id}Enabled`;
            const promptField = `${section.id}Prompt`;
            const delayField = `${section.id}Delay`;
            
            return (
              <div key={section.id} className={`bg-white rounded-lg border ${colors.border} overflow-hidden mb-4`}>
                <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={section.enabled}
                        onChange={(enabled) => setSettingsData({ ...settingsData, [enabledField]: enabled })}
                        disabled={!canInteract}
                        className={`${section.enabled ? colors.switch : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                      >
                        <span className={`${section.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                      </Switch>
                      <div className="flex items-center gap-2">
                        {section.icon}
                        <div>
                          <h3 className={`text-lg font-semibold ${colors.text}`}>{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addKeywordTrigger(fieldName)}
                      disabled={!section.enabled || !canInteract}
                      className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Keyword Trigger
                    </button>
                  </div>
                </div>

                <div className={`p-4 space-y-4 ${!section.enabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* How It Works Explanation */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <IconBulb className="w-4 h-4" />
                      How This Automation Works
                    </h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Step 1:</strong> User engages with your Instagram content (comment, story reaction, etc.)</p>
                      <p><strong>Step 2:</strong> We analyze their engagement for keywords/intent</p>
                      <p><strong>Step 3:</strong> Send appropriate response:</p>
                      <ul className="ml-4 space-y-1">
                        <li>• <strong>Keyword match found</strong> → Send custom keyword response</li>
                        <li>• <strong>No keyword match</strong> → Send default response (if enabled)</li>
                        <li>• <strong>AI detection</strong> → Use AI to detect {section.title.toLowerCase()} intent</li>
                      </ul>
                    </div>
                  </div>

                  {/* AI Detection Toggle */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <IconBulb className="w-4 h-4" />
                          AI Intent Detection
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Use AI to automatically detect when users show interest in {section.title.toLowerCase()}, even without specific keywords
                        </p>
                      </div>
                      <Switch
                        checked={settingsData[`${section.id}AiEnabled`] || false}
                        onChange={(enabled) => setSettingsData({ ...settingsData, [`${section.id}AiEnabled`]: enabled })}
                        disabled={!canInteract}
                        className={`${settingsData[`${section.id}AiEnabled`] ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                      >
                        <span className={`${settingsData[`${section.id}AiEnabled`] ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                      </Switch>
                    </div>
                  </div>

                  {/* Default Response Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                      Default Response (Fallback)
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-3">
                        <strong>When used:</strong> When AI detects {section.title.toLowerCase()} intent OR no specific keywords match
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Response Template</label>
                          <textarea
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                            rows={3}
                            value={section.prompt}
                            onChange={(e) => setSettingsData({ ...settingsData, [promptField]: e.target.value })}
                            placeholder={getDefaultPromptPlaceholder(section.id)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Response Delay (seconds)</label>
                          <input
                            type="number"
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                            value={section.delay}
                            onChange={(e) => setSettingsData({ ...settingsData, [delayField]: Number(e.target.value) })}
                          />
                          <p className="text-xs text-gray-500 mt-1">How long to wait before sending the DM</p>
                        </div>
                      </div>

                      {/* Default Attachments */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">Default Attachments</label>
                          <label className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}>
                            <IconPaperclip className="w-4 h-4" />
                            Add Files
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => e.target.files && handleFileUpload(e.target.files, `${section.id}Attachments`)}
                            />
                          </label>
                        </div>
                        
                        {/* File Upload Area */}
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files) handleFileUpload(files, `${section.id}Attachments`);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <IconUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Drag & drop files here, or click "Add Files"</p>
                          <p className="text-xs text-gray-500">Supports: Images (JPG, PNG, GIF) and PDFs • Max 10MB per file</p>
                        </div>

                        {/* Attached Files List */}
                        {(settingsData[`${section.id}Attachments`] || []).length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Attached Files ({(settingsData[`${section.id}Attachments`] || []).length})</h5>
                            <div className="space-y-2">
                              {(settingsData[`${section.id}Attachments`] || []).map((attachment: FileAttachment) => (
                                <div key={attachment.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center gap-3">
                                    {attachment.type === 'image' ? (
                                      <IconPhoto className="w-5 h-5 text-blue-500" />
                                    ) : (
                                      <IconFileText className="w-5 h-5 text-red-500" />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">{attachment.name}</p>
                                      <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeAttachment(`${section.id}Attachments`, attachment.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <IconX className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Keyword Triggers */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        Specific Keyword Triggers (Priority)
                      </h4>
                      <button
                        onClick={() => addKeywordTrigger(fieldName)}
                        disabled={!section.enabled || !canInteract}
                        className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                      >
                        <IconPlus className="w-4 h-4" />
                        Add Keyword Trigger
                      </button>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700 mb-2">
                        <strong>When used:</strong> When user's comment contains these exact keywords/phrases (takes priority over default response)
                      </p>
                      <p className="text-xs text-green-600">
                        💡 <strong>Examples for {section.title}:</strong> {getKeywordExamples(section.id)}
                      </p>
                    </div>

                    {(section.keywords || []).length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                          {section.icon}
                          <p>No keyword triggers configured</p>
                          <p className="text-xs">Add specific keywords for more targeted responses</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(section.keywords || []).map((trigger, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-700">Keyword Trigger #{index + 1}</h5>
                              <button
                                onClick={() => removeKeywordTrigger(fieldName, index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <IconTrash className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Trigger Keyword/Phrase
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                  value={trigger.keyword}
                                  onChange={(e) => updateKeywordTrigger(fieldName, index, 'keyword', e.target.value)}
                                  placeholder={getKeywordPlaceholder(section.id)}
                                />
                                <p className="text-xs text-gray-500 mt-1">Not case-sensitive</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Custom Response
                                  <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                  type="text"
                                  className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                  value={trigger.prompt}
                                  onChange={(e) => updateKeywordTrigger(fieldName, index, 'prompt', e.target.value)}
                                  placeholder="Leave empty to use default response"
                                />
                                <p className="text-xs text-gray-500 mt-1">Override default response for this keyword</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                                <input
                                  type="number"
                                  className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                  value={trigger.delay}
                                  onChange={(e) => updateKeywordTrigger(fieldName, index, 'delay', Number(e.target.value))}
                                  placeholder="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">0 = instant response</p>
                              </div>
                            </div>

                            {/* Keyword-specific attachments */}
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">Keyword-Specific Attachments</label>
                                <label className={`flex items-center gap-2 px-2 py-1 text-xs ${colors.switch} text-white rounded hover:opacity-90 transition-opacity cursor-pointer`}>
                                  <IconPaperclip className="w-3 h-3" />
                                  Add Files
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={(e) => e.target.files && addKeywordAttachment(fieldName, index, e.target.files)}
                                  />
                                </label>
                              </div>
                              
                              {/* Keyword attachments list */}
                              {(trigger.attachments || []).length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs text-gray-600">Files attached to this keyword trigger:</p>
                                  <div className="space-y-1">
                                    {(trigger.attachments || []).map((attachment) => (
                                      <div key={attachment.id} className="flex items-center justify-between bg-gray-100 rounded p-2">
                                        <div className="flex items-center gap-2">
                                          {attachment.type === 'image' ? (
                                            <IconPhoto className="w-4 h-4 text-blue-500" />
                                          ) : (
                                            <IconFileText className="w-4 h-4 text-red-500" />
                                          )}
                                          <span className="text-xs text-gray-700">{attachment.name}</span>
                                          <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                                        </div>
                                        <button
                                          onClick={() => removeKeywordAttachment(fieldName, index, attachment.id)}
                                          className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                          <IconX className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-500">
                                💡 <strong>Tip:</strong> Files attached here will be sent instead of default attachments for this keyword
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-purple-200">
          <button 
            disabled={!canInteract}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Automation Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramReactions;
