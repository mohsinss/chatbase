"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandTwitter, IconPlus, IconTrash, IconAlertTriangle, IconTestPipe, IconPhoto, IconVideo, IconUsers, IconHeart, IconMessageCircle, IconStar, IconGift, IconTrendingUp, IconShoppingCart, IconMapPin, IconCalendar, IconBulb, IconPaperclip, IconFileText, IconX, IconUpload, IconEye, IconUserPlus, IconRepeat, IconShare, IconTarget, IconCrown, IconRocket } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

interface TwitterReactionsProps {
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
  replyDmEnabled: boolean;
  replyDmPrompt: string;
  replyDmDelay: number;
  keywordDmEnabled: boolean;
  keywordTriggers: KeywordTrigger[];
  likeDmEnabled: boolean;
  likeDmPrompt: string;
  likeDmDelay: number;
  likeDmFirstOnly: boolean;
  likeDmSpecificTweets: { tweetUrl: string; prompt: string; delay: number }[];
  retweetDmEnabled: boolean;
  retweetDmPrompt: string;
  retweetDmDelay: number;
  retweetDmFirstOnly: boolean;
  retweetDmSpecificTweets: { tweetUrl: string; prompt: string; delay: number }[];
  mentionDmEnabled: boolean;
  mentionDmPrompt: string;
  mentionDmDelay: number;
  
  // Twitter Thread Engagement
  threadEngagementEnabled: boolean;
  threadKeywords: KeywordTrigger[];
  threadPrompt: string;
  threadDelay: number;
  threadAttachments: FileAttachment[];
  
  // Quote Tweet Responses
  quoteTweetEnabled: boolean;
  quoteTweetKeywords: KeywordTrigger[];
  quoteTweetPrompt: string;
  quoteTweetDelay: number;
  quoteTweetAttachments: FileAttachment[];
  
  // Twitter Space Engagement
  spaceEngagementEnabled: boolean;
  spaceKeywords: KeywordTrigger[];
  spacePrompt: string;
  spaceDelay: number;
  spaceAttachments: FileAttachment[];
  
  // Viral Tweet Amplification
  viralAmplificationEnabled: boolean;
  viralKeywords: KeywordTrigger[];
  viralPrompt: string;
  viralDelay: number;
  viralAttachments: FileAttachment[];
  
  // Community Building
  communityBuildingEnabled: boolean;
  communityKeywords: KeywordTrigger[];
  communityPrompt: string;
  communityDelay: number;
  communityAttachments: FileAttachment[];
  
  // Twitter List Management
  listManagementEnabled: boolean;
  listKeywords: KeywordTrigger[];
  listPrompt: string;
  listDelay: number;
  listAttachments: FileAttachment[];
  
  // Thought Leadership
  thoughtLeadershipEnabled: boolean;
  thoughtLeadershipKeywords: KeywordTrigger[];
  thoughtLeadershipPrompt: string;
  thoughtLeadershipDelay: number;
  thoughtLeadershipAttachments: FileAttachment[];
  
  // Twitter Chat Participation
  chatParticipationEnabled: boolean;
  chatKeywords: KeywordTrigger[];
  chatPrompt: string;
  chatDelay: number;
  chatAttachments: FileAttachment[];
  
  // Trending Topic Engagement
  trendingTopicEnabled: boolean;
  trendingKeywords: KeywordTrigger[];
  trendingPrompt: string;
  trendingDelay: number;
  trendingAttachments: FileAttachment[];
  
  // Twitter Analytics Insights
  analyticsInsightsEnabled: boolean;
  analyticsKeywords: KeywordTrigger[];
  analyticsPrompt: string;
  analyticsDelay: number;
  analyticsAttachments: FileAttachment[];
  
  // AI Detection toggles for each automation
  threadEngagementAiEnabled: boolean;
  quoteTweetAiEnabled: boolean;
  spaceEngagementAiEnabled: boolean;
  viralAmplificationAiEnabled: boolean;
  communityBuildingAiEnabled: boolean;
  listManagementAiEnabled: boolean;
  thoughtLeadershipAiEnabled: boolean;
  chatParticipationAiEnabled: boolean;
  trendingTopicAiEnabled: boolean;
  analyticsInsightsAiEnabled: boolean;
  
  // Allow dynamic property access
  [key: string]: any;
}

const TwitterReactions = ({ chatbot }: TwitterReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    // Original reactions - keeping these
    replyDmEnabled: false,
    replyDmPrompt: "Thanks for your reply! I'd love to continue this conversation in DM. How can I assist you?",
    replyDmDelay: 0,
    keywordDmEnabled: false,
    keywordTriggers: [],
    likeDmEnabled: false,
    likeDmPrompt: "Thanks for liking our tweet! We're glad you enjoyed it. How can we help you today?",
    likeDmDelay: 0,
    likeDmFirstOnly: false,
    likeDmSpecificTweets: [],
    retweetDmEnabled: false,
    retweetDmPrompt: "Thanks for retweeting! We appreciate your support. How can we help you today?",
    retweetDmDelay: 0,
    retweetDmFirstOnly: false,
    retweetDmSpecificTweets: [],
    mentionDmEnabled: false,
    mentionDmPrompt: "Thanks for mentioning us! How can we help you today?",
    mentionDmDelay: 0,
    
    // Twitter Thread Engagement
    threadEngagementEnabled: false,
    threadKeywords: [],
    threadPrompt: "🧵 Great thread engagement! Here's additional value related to this topic:",
    threadDelay: 2,
    threadAttachments: [],
    
    // Quote Tweet Responses
    quoteTweetEnabled: false,
    quoteTweetKeywords: [],
    quoteTweetPrompt: "💬 Thanks for quote tweeting! Here's more context on this topic:",
    quoteTweetDelay: 1,
    quoteTweetAttachments: [],
    
    // Twitter Space Engagement
    spaceEngagementEnabled: false,
    spaceKeywords: [],
    spacePrompt: "🎙️ Thanks for joining our Space! Here's the follow-up content we mentioned:",
    spaceDelay: 3,
    spaceAttachments: [],
    
    // Viral Tweet Amplification
    viralAmplificationEnabled: false,
    viralKeywords: [],
    viralPrompt: "🚀 Your engagement is helping this go viral! Here's exclusive content for early supporters:",
    viralDelay: 1,
    viralAttachments: [],
    
    // Community Building
    communityBuildingEnabled: false,
    communityKeywords: [],
    communityPrompt: "🤝 Love connecting with our community! Here's how to get more involved:",
    communityDelay: 2,
    communityAttachments: [],
    
    // Twitter List Management
    listManagementEnabled: false,
    listKeywords: [],
    listPrompt: "📋 You've been added to our curated list! Here's what that means for you:",
    listDelay: 1,
    listAttachments: [],
    
    // Thought Leadership
    thoughtLeadershipEnabled: false,
    thoughtLeadershipKeywords: [],
    thoughtLeadershipPrompt: "💡 Great insight! Here's our detailed perspective on this topic:",
    thoughtLeadershipDelay: 3,
    thoughtLeadershipAttachments: [],
    
    // Twitter Chat Participation
    chatParticipationEnabled: false,
    chatKeywords: [],
    chatPrompt: "💬 Thanks for participating in the Twitter chat! Here's the recap and next steps:",
    chatDelay: 2,
    chatAttachments: [],
    
    // Trending Topic Engagement
    trendingTopicEnabled: false,
    trendingKeywords: [],
    trendingPrompt: "📈 You're engaging with trending topics! Here's our take and additional resources:",
    trendingDelay: 1,
    trendingAttachments: [],
    
    // Twitter Analytics Insights
    analyticsInsightsEnabled: false,
    analyticsKeywords: [],
    analyticsPrompt: "📊 Interested in analytics? Here's exclusive data insights and tools:",
    analyticsDelay: 2,
    analyticsAttachments: [],
    
    // AI Detection toggles for each automation
    threadEngagementAiEnabled: false,
    quoteTweetAiEnabled: false,
    spaceEngagementAiEnabled: false,
    viralAmplificationAiEnabled: false,
    communityBuildingAiEnabled: false,
    listManagementAiEnabled: false,
    thoughtLeadershipAiEnabled: false,
    chatParticipationAiEnabled: false,
    trendingTopicAiEnabled: false,
    analyticsInsightsAiEnabled: false
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        // Original reactions test data
        replyDmEnabled: true,
        keywordDmEnabled: true,
        keywordTriggers: [
          { keyword: "help", prompt: "I see you need help! Let me assist you with that.", delay: 2 },
          { keyword: "pricing", prompt: "Great question about pricing! Let me share our current rates with you.", delay: 1 }
        ],
        likeDmEnabled: true,
        retweetDmEnabled: true,
        mentionDmEnabled: true,
        
        // New automations test data
        threadEngagementEnabled: true,
        threadKeywords: [
          { keyword: "thread", prompt: "🧵 Love your thread engagement! Here's bonus content on this topic:", delay: 2 },
          { keyword: "insights", prompt: "💡 Great insights! Here's our detailed analysis on this:", delay: 1 }
        ],
        quoteTweetEnabled: true,
        quoteTweetKeywords: [
          { keyword: "quote", prompt: "💬 Thanks for the quote tweet! Here's additional context:", delay: 1 }
        ],
        spaceEngagementEnabled: true,
        spaceKeywords: [
          { keyword: "space", prompt: "🎙️ Thanks for joining! Here's the follow-up we promised:", delay: 3 }
        ],
        viralAmplificationEnabled: true,
        communityBuildingEnabled: true,
        listManagementEnabled: true,
        thoughtLeadershipEnabled: true,
        chatParticipationEnabled: true,
        trendingTopicEnabled: true,
        analyticsInsightsEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    const loadingToastId = toast.loading('Connecting to Twitter...', { duration: Infinity });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      toast.dismiss(loadingToastId);
      toast.success('🐦 Successfully connected to Twitter!');
    } catch (error) {
      console.error('Failed to connect to Twitter:', error);
      toast.dismiss(loadingToastId);
      toast.error('❌ Failed to connect to Twitter. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const addKeywordTrigger = (field: string) => {
    setSettingsData({
      ...settingsData,
      [field]: [...(settingsData[field] || []), { keyword: "", prompt: "", delay: 0 }]
    });
    toast.success('✨ New keyword trigger added!');
  };

  const removeKeywordTrigger = (field: string, index: number) => {
    const newTriggers = [...(settingsData[field] || [])];
    newTriggers.splice(index, 1);
    setSettingsData({ ...settingsData, [field]: newTriggers });
    toast.success('🗑️ Keyword trigger removed');
  };

  const updateKeywordTrigger = (field: string, index: number, property: string, value: any) => {
    const newTriggers = [...(settingsData[field] || [])];
    newTriggers[index][property] = value;
    setSettingsData({ ...settingsData, [field]: newTriggers });
  };

  const addSpecificTweet = (type: 'like' | 'retweet') => {
    const field = type === 'like' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
    setSettingsData({
      ...settingsData,
      [field]: [...(settingsData[field] || []), { tweetUrl: "", prompt: "", delay: 0 }]
    });
    toast.success(`✨ New ${type} tweet setting added!`);
  };

  const removeSpecificTweet = (index: number, type: 'like' | 'retweet') => {
    const field = type === 'like' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
    const newTweets = [...(settingsData[field] || [])];
    newTweets.splice(index, 1);
    setSettingsData({ ...settingsData, [field]: newTweets });
    toast.success(`🗑️ ${type} tweet setting removed`);
  };

  const handleAiToggle = (automationName: string, field: string, enabled: boolean) => {
    setSettingsData({ ...settingsData, [field]: enabled });
    if (enabled) {
      toast.success(`🤖 AI Intent Detection enabled for ${automationName}!`);
    } else {
      toast.success(`🤖 AI Intent Detection disabled for ${automationName}`);
    }
  };

  const handleAutomationToggle = (automationName: string, field: string, enabled: boolean) => {
    setSettingsData({ ...settingsData, [field]: enabled });
    if (enabled) {
      toast.success(`🚀 ${automationName} activated!`);
    } else {
      toast.success(`⏸️ ${automationName} deactivated`);
    }
  };

  // Original reaction sections - restyled to match new design
  const originalReactionSections = [
    {
      id: 'replyDm',
      title: 'Reply-Triggered DMs',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Send automated DMs when users reply to your tweets',
      enabled: settingsData.replyDmEnabled,
      color: 'blue',
      hasSubSettings: true
    },
    {
      id: 'keywordDm',
      title: 'Keyword-Triggered DMs',
      icon: <IconBulb className="w-5 h-5" />,
      description: 'Trigger specific responses based on reply keywords',
      enabled: settingsData.keywordDmEnabled,
      keywords: settingsData.keywordTriggers,
      keywordField: 'keywordTriggers',
      color: 'indigo',
      hasKeywords: true
    },
    {
      id: 'likeDm',
      title: 'Like DMs',
      icon: <IconHeart className="w-5 h-5" />,
      description: 'Send DMs when users like your tweets',
      enabled: settingsData.likeDmEnabled,
      color: 'rose',
      hasSpecificTweets: true,
      specificTweets: settingsData.likeDmSpecificTweets,
      prompt: settingsData.likeDmPrompt,
      delay: settingsData.likeDmDelay,
      firstOnly: settingsData.likeDmFirstOnly
    },
    {
      id: 'retweetDm',
      title: 'Retweet DMs',
      icon: <IconRepeat className="w-5 h-5" />,
      description: 'Send DMs when users retweet your content',
      enabled: settingsData.retweetDmEnabled,
      color: 'green',
      hasSpecificTweets: true,
      specificTweets: settingsData.retweetDmSpecificTweets,
      prompt: settingsData.retweetDmPrompt,
      delay: settingsData.retweetDmDelay,
      firstOnly: settingsData.retweetDmFirstOnly
    },
    {
      id: 'mentionDm',
      title: 'Mention DMs',
      icon: <IconUserPlus className="w-5 h-5" />,
      description: 'Respond when users mention your account',
      enabled: settingsData.mentionDmEnabled,
      color: 'purple',
      hasSubSettings: true
    }
  ];

  const reactionSections = [
    {
      id: 'threadEngagement',
      title: 'Twitter Thread Engagement',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Auto-engage with users who interact with your Twitter threads',
      enabled: settingsData.threadEngagementEnabled,
      keywords: settingsData.threadKeywords,
      keywordField: 'threadKeywords',
      prompt: settingsData.threadPrompt,
      delay: settingsData.threadDelay,
      color: 'blue'
    },
    {
      id: 'quoteTweet',
      title: 'Quote Tweet Responses',
      icon: <IconShare className="w-5 h-5" />,
      description: 'Auto-respond to users who quote tweet your content',
      enabled: settingsData.quoteTweetEnabled,
      keywords: settingsData.quoteTweetKeywords,
      keywordField: 'quoteTweetKeywords',
      prompt: settingsData.quoteTweetPrompt,
      delay: settingsData.quoteTweetDelay,
      color: 'green'
    },
    {
      id: 'spaceEngagement',
      title: 'Twitter Space Engagement',
      icon: <IconVideo className="w-5 h-5" />,
      description: 'Auto-follow up with Twitter Space participants',
      enabled: settingsData.spaceEngagementEnabled,
      keywords: settingsData.spaceKeywords,
      keywordField: 'spaceKeywords',
      prompt: settingsData.spacePrompt,
      delay: settingsData.spaceDelay,
      color: 'purple'
    },
    {
      id: 'viralAmplification',
      title: 'Viral Tweet Amplification',
      icon: <IconRocket className="w-5 h-5" />,
      description: 'Auto-engage with users helping your tweets go viral',
      enabled: settingsData.viralAmplificationEnabled,
      keywords: settingsData.viralKeywords,
      keywordField: 'viralKeywords',
      prompt: settingsData.viralPrompt,
      delay: settingsData.viralDelay,
      color: 'red'
    },
    {
      id: 'communityBuilding',
      title: 'Community Building',
      icon: <IconUsers className="w-5 h-5" />,
      description: 'Auto-nurture engaged community members',
      enabled: settingsData.communityBuildingEnabled,
      keywords: settingsData.communityKeywords,
      keywordField: 'communityKeywords',
      prompt: settingsData.communityPrompt,
      delay: settingsData.communityDelay,
      color: 'indigo'
    },
    {
      id: 'listManagement',
      title: 'Twitter List Management',
      icon: <IconTarget className="w-5 h-5" />,
      description: 'Auto-engage with users added to your Twitter lists',
      enabled: settingsData.listManagementEnabled,
      keywords: settingsData.listKeywords,
      keywordField: 'listKeywords',
      prompt: settingsData.listPrompt,
      delay: settingsData.listDelay,
      color: 'orange'
    },
    {
      id: 'thoughtLeadership',
      title: 'Thought Leadership',
      icon: <IconCrown className="w-5 h-5" />,
      description: 'Auto-share insights with users engaging on industry topics',
      enabled: settingsData.thoughtLeadershipEnabled,
      keywords: settingsData.thoughtLeadershipKeywords,
      keywordField: 'thoughtLeadershipKeywords',
      prompt: settingsData.thoughtLeadershipPrompt,
      delay: settingsData.thoughtLeadershipDelay,
      color: 'yellow'
    },
    {
      id: 'chatParticipation',
      title: 'Twitter Chat Participation',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Auto-follow up with Twitter chat participants',
      enabled: settingsData.chatParticipationEnabled,
      keywords: settingsData.chatKeywords,
      keywordField: 'chatKeywords',
      prompt: settingsData.chatPrompt,
      delay: settingsData.chatDelay,
      color: 'teal'
    },
    {
      id: 'trendingTopic',
      title: 'Trending Topic Engagement',
      icon: <IconTrendingUp className="w-5 h-5" />,
      description: 'Auto-engage with users discussing trending topics',
      enabled: settingsData.trendingTopicEnabled,
      keywords: settingsData.trendingKeywords,
      keywordField: 'trendingKeywords',
      prompt: settingsData.trendingPrompt,
      delay: settingsData.trendingDelay,
      color: 'pink'
    },
    {
      id: 'analyticsInsights',
      title: 'Twitter Analytics Insights',
      icon: <IconRocket className="w-5 h-5" />,
      description: 'Auto-share analytics insights with engaged users',
      enabled: settingsData.analyticsInsightsEnabled,
      keywords: settingsData.analyticsKeywords,
      keywordField: 'analyticsKeywords',
      prompt: settingsData.analyticsPrompt,
      delay: settingsData.analyticsDelay,
      color: 'rose'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string; switch: string; focus: string } } = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', switch: 'bg-blue-500', focus: 'focus:ring-blue-500 focus:border-blue-500' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', switch: 'bg-purple-500', focus: 'focus:ring-purple-500 focus:border-purple-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', switch: 'bg-pink-500', focus: 'focus:ring-pink-500 focus:border-pink-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', switch: 'bg-green-500', focus: 'focus:ring-green-500 focus:border-green-500' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', switch: 'bg-red-500', focus: 'focus:ring-red-500 focus:border-red-500' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', switch: 'bg-yellow-500', focus: 'focus:ring-yellow-500 focus:border-yellow-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', switch: 'bg-indigo-500', focus: 'focus:ring-indigo-500 focus:border-indigo-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', switch: 'bg-orange-500', focus: 'focus:ring-orange-500 focus:border-orange-500' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', switch: 'bg-teal-500', focus: 'focus:ring-teal-500 focus:border-teal-500' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', switch: 'bg-rose-500', focus: 'focus:ring-rose-500 focus:border-rose-500' }
    };
    return colors[color] || colors.blue;
  };

  const getDefaultPromptPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      threadEngagement: "🧵 Great thread engagement! Here's additional value related to this topic:",
      quoteTweet: "💬 Thanks for quote tweeting! Here's more context on this topic:",
      spaceEngagement: "🎙️ Thanks for joining our Space! Here's the follow-up content we mentioned:",
      viralAmplification: "🚀 Your engagement is helping this go viral! Here's exclusive content for early supporters:",
      communityBuilding: "🤝 Love connecting with our community! Here's how to get more involved:",
      listManagement: "📋 You've been added to our curated list! Here's what that means for you:",
      thoughtLeadership: "💡 Great insight! Here's our detailed perspective on this topic:",
      chatParticipation: "💬 Thanks for participating in the Twitter chat! Here's the recap and next steps:",
      trendingTopic: "📈 You're engaging with trending topics! Here's our take and additional resources:",
      analyticsInsights: "📊 Interested in analytics? Here's exclusive data insights and tools:"
    };
    return placeholders[sectionId] || "Enter your default response message...";
  };

  const getKeywordExamples = (sectionId: string) => {
    const examples: { [key: string]: string } = {
      threadEngagement: '"thread", "insights", "breakdown", "analysis", "deep dive"',
      quoteTweet: '"quote", "thoughts", "perspective", "opinion", "take"',
      spaceEngagement: '"space", "live", "audio", "discussion", "chat"',
      viralAmplification: '"viral", "trending", "share", "spread", "amplify"',
      communityBuilding: '"community", "connect", "network", "together", "join"',
      listManagement: '"list", "curated", "follow", "organize", "group"',
      thoughtLeadership: '"insight", "expert", "opinion", "analysis", "perspective"',
      chatParticipation: '"chat", "discuss", "participate", "engage", "join"',
      trendingTopic: '"trending", "hot", "viral", "popular", "buzz"',
      analyticsInsights: '"analytics", "data", "metrics", "insights", "stats"'
    };
    return examples[sectionId] || '"keyword1", "keyword2", "phrase"';
  };

  const getKeywordPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      threadEngagement: "thread",
      quoteTweet: "quote",
      spaceEngagement: "space",
      viralAmplification: "viral",
      communityBuilding: "community",
      listManagement: "list",
      thoughtLeadership: "insight",
      chatParticipation: "chat",
      trendingTopic: "trending",
      analyticsInsights: "analytics"
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
        toast.error(`❌ ${file.name} is not a supported file type. Please upload images or PDFs only.`);
        continue;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`❌ ${file.name} is too large. Please upload files smaller than 10MB.`);
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
    
    if (newAttachments.length > 0) {
      // Add to existing attachments
      const currentAttachments = settingsData[field] || [];
      setSettingsData({
        ...settingsData,
        [field]: [...currentAttachments, ...newAttachments]
      });
      
      const fileText = newAttachments.length === 1 ? 'file' : 'files';
      toast.success(`📎 ${newAttachments.length} ${fileText} attached successfully!`);
    }
  };

  const removeAttachment = (field: string, attachmentId: string) => {
    const currentAttachments = settingsData[field] || [];
    const updatedAttachments = currentAttachments.filter((attachment: FileAttachment) => attachment.id !== attachmentId);
    setSettingsData({ ...settingsData, [field]: updatedAttachments });
    toast.success('🗑️ File removed successfully');
  };

  const addKeywordAttachment = (field: string, keywordIndex: number, files: FileList) => {
    const newAttachments: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!isValidType) {
        toast.error(`❌ ${file.name} is not a supported file type. Please upload images or PDFs only.`);
        continue;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`❌ ${file.name} is too large. Please upload files smaller than 10MB.`);
        continue;
      }
      
      const attachment: FileAttachment = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        url: URL.createObjectURL(file),
        size: file.size
      };
      
      newAttachments.push(attachment);
    }
    
    if (newAttachments.length > 0) {
      const newTriggers = [...(settingsData[field] || [])];
      newTriggers[keywordIndex].attachments = [...(newTriggers[keywordIndex].attachments || []), ...newAttachments];
      setSettingsData({ ...settingsData, [field]: newTriggers });
      
      const fileText = newAttachments.length === 1 ? 'file' : 'files';
      toast.success(`📎 ${newAttachments.length} ${fileText} attached to keyword trigger!`);
    }
  };

  const removeKeywordAttachment = (field: string, keywordIndex: number, attachmentId: string) => {
    const newTriggers = [...(settingsData[field] || [])];
    newTriggers[keywordIndex].attachments = (newTriggers[keywordIndex].attachments || []).filter(
      (attachment: FileAttachment) => attachment.id !== attachmentId
    );
    setSettingsData({ ...settingsData, [field]: newTriggers });
    toast.success('🗑️ File removed from keyword trigger');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">Twitter Not Connected</p>
                <p className="text-xs text-orange-600">Connect your Twitter account to enable these powerful automation features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
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
                {isConnecting ? "Connecting..." : "Connect Twitter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandTwitter className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">Twitter Growth Automation</h1>
              <p className="mt-1 text-white/80">10 powerful automations to turn Twitter engagement into business growth</p>
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
            <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full">Essential</span>
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
                        onChange={(enabled) => handleAutomationToggle(section.title, `${section.id}Enabled`, enabled)}
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
                    {section.hasSpecificTweets && (
                      <button
                        onClick={() => addSpecificTweet(section.id === 'likeDm' ? 'like' : 'retweet')}
                        disabled={!section.enabled || !canInteract}
                        className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                      >
                        <IconPlus className="w-4 h-4" />
                        Add Tweet
                      </button>
                    )}
                  </div>
                </div>

                <div className={`p-4 space-y-4 ${!section.enabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Reply DM specific settings */}
                  {section.id === 'replyDm' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reply DM Template</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                          rows={3}
                          value={settingsData.replyDmPrompt}
                          onChange={(e) => setSettingsData({ ...settingsData, replyDmPrompt: e.target.value })}
                          placeholder="Enter message for reply authors..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.replyDmDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, replyDmDelay: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mention DM specific settings */}
                  {section.id === 'mentionDm' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mention DM Template</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                          rows={3}
                          value={settingsData.mentionDmPrompt}
                          onChange={(e) => setSettingsData({ ...settingsData, mentionDmPrompt: e.target.value })}
                          placeholder="Enter message for mentions..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.mentionDmDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, mentionDmDelay: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Keyword DM specific settings */}
                  {section.id === 'keywordDm' && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-700">Keyword Triggers</h4>
                        <button
                          onClick={() => addKeywordTrigger(section.keywordField)}
                          disabled={!section.enabled || !canInteract}
                          className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                        >
                          <IconPlus className="w-4 h-4" />
                          Add Keyword Trigger
                        </button>
                      </div>
                      {(settingsData.keywordTriggers || []).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            {section.icon}
                            <p>No keyword triggers configured. Click "Add Keyword Trigger" to get started.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(settingsData.keywordTriggers || []).map((trigger, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-700">Keyword Trigger {index + 1}</h5>
                                <button
                                  onClick={() => removeKeywordTrigger(section.keywordField, index)}
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
                                      const newTriggers = [...(settingsData[section.keywordField] || [])];
                                      newTriggers[index].keyword = e.target.value;
                                      setSettingsData({ ...settingsData, [section.keywordField]: newTriggers });
                                    }}
                                    placeholder="help"
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
                                      const newTriggers = [...(settingsData[section.keywordField] || [])];
                                      newTriggers[index].prompt = e.target.value;
                                      setSettingsData({ ...settingsData, [section.keywordField]: newTriggers });
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
                                      const newTriggers = [...(settingsData[section.keywordField] || [])];
                                      newTriggers[index].delay = Number(e.target.value);
                                      setSettingsData({ ...settingsData, [section.keywordField]: newTriggers });
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
                                      onChange={(e) => e.target.files && addKeywordAttachment(section.keywordField, index, e.target.files)}
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
                                            onClick={() => removeKeywordAttachment(section.keywordField, index, attachment.id)}
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

                  {/* Like DM and Retweet DM specific settings */}
                  {(section.id === 'likeDm' || section.id === 'retweetDm') && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default {section.id === 'likeDm' ? 'Like' : 'Retweet'} DM Template</label>
                          <textarea
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                            rows={3}
                            value={section.prompt}
                            onChange={(e) => setSettingsData({ ...settingsData, [section.id === 'likeDm' ? 'likeDmPrompt' : 'retweetDmPrompt']: e.target.value })}
                            placeholder={`Enter default message for ${section.id === 'likeDm' ? 'likes' : 'retweets'}...`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Delay (seconds)</label>
                          <input
                            type="number"
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                            value={section.delay}
                            onChange={(e) => setSettingsData({ ...settingsData, [section.id === 'likeDm' ? 'likeDmDelay' : 'retweetDmDelay']: Number(e.target.value) })}
                          />
                          <div className="mt-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={section.firstOnly}
                                onChange={(e) => setSettingsData({ ...settingsData, [section.id === 'likeDm' ? 'likeDmFirstOnly' : 'retweetDmFirstOnly']: e.target.checked })}
                                className={`rounded border-gray-300 ${colors.switch} focus:ring-2 ${colors.focus}`}
                              />
                              <span className="text-sm text-gray-700">Send DM only on first {section.id === 'likeDm' ? 'like' : 'retweet'}</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {(section.specificTweets || []).length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Specific Tweet Settings</h4>
                          {(section.specificTweets || []).map((tweet, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-700">Tweet {index + 1}</h5>
                                <button
                                  onClick={() => removeSpecificTweet(index, section.id === 'likeDm' ? 'like' : 'retweet')}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <IconTrash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Tweet URL</label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={tweet.tweetUrl}
                                    onChange={(e) => {
                                      const field = section.id === 'likeDm' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
                                      const newTweets = [...(settingsData[field] || [])];
                                      newTweets[index].tweetUrl = e.target.value;
                                      setSettingsData({ ...settingsData, [field]: newTweets });
                                    }}
                                    placeholder="https://twitter.com/..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={tweet.prompt}
                                    onChange={(e) => {
                                      const field = section.id === 'likeDm' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
                                      const newTweets = [...(settingsData[field] || [])];
                                      newTweets[index].prompt = e.target.value;
                                      setSettingsData({ ...settingsData, [field]: newTweets });
                                    }}
                                    placeholder="Leave empty for default"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Delay</label>
                                  <input
                                    type="number"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={tweet.delay}
                                    onChange={(e) => {
                                      const field = section.id === 'likeDm' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
                                      const newTweets = [...(settingsData[field] || [])];
                                      newTweets[index].delay = Number(e.target.value);
                                      setSettingsData({ ...settingsData, [field]: newTweets });
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

        {/* Advanced Twitter Automations Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Advanced Twitter Automations</h2>
            <span className="px-2 py-1 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 text-xs rounded-full">Premium</span>
          </div>
          
          {reactionSections.map((section) => {
            const colors = getColorClasses(section.color);
            const fieldName = section.keywordField;
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
                        onChange={(enabled) => handleAutomationToggle(section.title, enabledField, enabled)}
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
                      <p><strong>Step 1:</strong> User engages with your Twitter content (reply, retweet, like, etc.)</p>
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
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
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
                        onChange={(enabled) => handleAiToggle(section.title, `${section.id}AiEnabled`, enabled)}
                        disabled={!canInteract}
                        className={`${settingsData[`${section.id}AiEnabled`] ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
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
                        <strong>When used:</strong> When user's reply/engagement contains these exact keywords/phrases (takes priority over default response)
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
        <div className="flex justify-end pt-4 border-t border-sky-200">
          <button 
            disabled={!canInteract}
            onClick={() => {
              toast.success('💾 Twitter automation settings saved successfully!');
            }}
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Automation Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterReactions;