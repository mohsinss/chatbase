"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandLinkedin, IconLoader, IconTrash, IconPlus, IconAlertTriangle, IconTestPipe, IconPhoto, IconVideo, IconUsers, IconHeart, IconMessageCircle, IconStar, IconGift, IconTrendingUp, IconShoppingCart, IconMapPin, IconCalendar, IconBulb, IconPaperclip, IconFileText, IconX, IconUpload, IconEye, IconUserPlus, IconRepeat, IconShare, IconTarget, IconCrown, IconRocket, IconPhone, IconMail, IconClock, IconBell, IconSettings, IconChartBar, IconTag, IconCreditCard, IconTruck, IconHeadphones, IconThumbUp, IconSend, IconBriefcase, IconNetwork, IconTrophy, IconBuilding, IconSchool } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

interface LinkedInReactionsProps {
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
  type: 'pdf' | 'image' | 'video' | 'audio';
  url: string;
  size: number;
}

interface SettingsData {
  // Essential Features
  postResponseEnabled: boolean;
  postResponsePrompt: string;
  postResponseDelay: number;
  postResponseAttachments: FileAttachment[];
  
  commentResponseEnabled: boolean;
  commentResponsePrompt: string;
  commentResponseDelay: number;
  commentResponseAttachments: FileAttachment[];
  
  // Premium Features
  messageResponseEnabled: boolean;
  messageKeywords: KeywordTrigger[];
  messagePrompt: string;
  messageDelay: number;
  messageAttachments: FileAttachment[];
  
  newConnectionDMEnabled: boolean;
  newConnectionKeywords: KeywordTrigger[];
  newConnectionPrompt: string;
  newConnectionDelay: number;
  newConnectionAttachments: FileAttachment[];
  
  keywordTriggersEnabled: boolean;
  keywordTriggers: KeywordTrigger[];
  
  leadGenerationEnabled: boolean;
  leadKeywords: KeywordTrigger[];
  leadPrompt: string;
  leadDelay: number;
  leadAttachments: FileAttachment[];
  
  jobPostingResponseEnabled: boolean;
  jobKeywords: KeywordTrigger[];
  jobPrompt: string;
  jobDelay: number;
  jobAttachments: FileAttachment[];
  
  networkingOutreachEnabled: boolean;
  networkingKeywords: KeywordTrigger[];
  networkingPrompt: string;
  networkingDelay: number;
  networkingAttachments: FileAttachment[];
  
  contentEngagementEnabled: boolean;
  contentKeywords: KeywordTrigger[];
  contentPrompt: string;
  contentDelay: number;
  contentAttachments: FileAttachment[];
  
  eventPromotionEnabled: boolean;
  eventKeywords: KeywordTrigger[];
  eventPrompt: string;
  eventDelay: number;
  eventAttachments: FileAttachment[];
  
  skillEndorsementEnabled: boolean;
  skillKeywords: KeywordTrigger[];
  skillPrompt: string;
  skillDelay: number;
  skillAttachments: FileAttachment[];
  
  companyPageManagementEnabled: boolean;
  companyKeywords: KeywordTrigger[];
  companyPrompt: string;
  companyDelay: number;
  companyAttachments: FileAttachment[];
  
  thoughtLeadershipEnabled: boolean;
  thoughtKeywords: KeywordTrigger[];
  thoughtPrompt: string;
  thoughtDelay: number;
  thoughtAttachments: FileAttachment[];
  
  recruitmentAutomationEnabled: boolean;
  recruitmentKeywords: KeywordTrigger[];
  recruitmentPrompt: string;
  recruitmentDelay: number;
  recruitmentAttachments: FileAttachment[];
  
  // AI Detection toggles for each automation
  postResponseAiEnabled: boolean;
  commentResponseAiEnabled: boolean;
  messageResponseAiEnabled: boolean;
  newConnectionDMAiEnabled: boolean;
  leadGenerationAiEnabled: boolean;
  jobPostingResponseAiEnabled: boolean;
  networkingOutreachAiEnabled: boolean;
  contentEngagementAiEnabled: boolean;
  eventPromotionAiEnabled: boolean;
  skillEndorsementAiEnabled: boolean;
  companyPageManagementAiEnabled: boolean;
  thoughtLeadershipAiEnabled: boolean;
  recruitmentAutomationAiEnabled: boolean;
  
  // Allow dynamic property access
  [key: string]: any;
}

const LinkedInReactions = ({ chatbot }: LinkedInReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    // Essential Features
    postResponseEnabled: false,
    postResponsePrompt: "�� Thanks for sharing this insightful post! I'd love to connect and discuss this topic further.",
    postResponseDelay: 2,
    postResponseAttachments: [],
    
    commentResponseEnabled: false,
    commentResponsePrompt: "👍 Great comment! I appreciate your perspective. Let's continue this conversation.",
    commentResponseDelay: 1,
    commentResponseAttachments: [],
    
    // Premium Features
    messageResponseEnabled: false,
    messageKeywords: [],
    messagePrompt: "📩 Thanks for reaching out! I'm excited to connect and explore potential opportunities together.",
    messageDelay: 1,
    messageAttachments: [],
    
    newConnectionDMEnabled: false,
    newConnectionKeywords: [],
    newConnectionPrompt: "🤝 Welcome to my network! I'm thrilled to connect. Here's how we can collaborate:",
    newConnectionDelay: 24,
    newConnectionAttachments: [],
    
    keywordTriggersEnabled: false,
    keywordTriggers: [],
    
    leadGenerationEnabled: false,
    leadKeywords: [],
    leadPrompt: "🎯 I see you're interested in our solutions! Let me share some valuable resources that could help:",
    leadDelay: 2,
    leadAttachments: [],
    
    jobPostingResponseEnabled: false,
    jobKeywords: [],
    jobPrompt: "💼 Exciting opportunity! I'd love to learn more about this role and how my skills align:",
    jobDelay: 3,
    jobAttachments: [],
    
    networkingOutreachEnabled: false,
    networkingKeywords: [],
    networkingPrompt: "🌐 I'd love to expand our professional network! Here are some ways we can collaborate:",
    networkingDelay: 2,
    networkingAttachments: [],
    
    contentEngagementEnabled: false,
    contentKeywords: [],
    contentPrompt: "📝 Fantastic content! This really resonates with my experience. Here's my take:",
    contentDelay: 1,
    contentAttachments: [],
    
    eventPromotionEnabled: false,
    eventKeywords: [],
    eventPrompt: "🎉 Exciting event! I'd love to attend and network with fellow professionals:",
    eventDelay: 2,
    eventAttachments: [],
    
    skillEndorsementEnabled: false,
    skillKeywords: [],
    skillPrompt: "⭐ I'd be happy to endorse your skills! Your expertise in this area is impressive:",
    skillDelay: 1,
    skillAttachments: [],
    
    companyPageManagementEnabled: false,
    companyKeywords: [],
    companyPrompt: "🏢 Thanks for following our company page! Here's what we're working on:",
    companyDelay: 2,
    companyAttachments: [],
    
    thoughtLeadershipEnabled: false,
    thoughtKeywords: [],
    thoughtPrompt: "💡 Thought-provoking insights! Here's my perspective on this industry trend:",
    thoughtDelay: 3,
    thoughtAttachments: [],
    
    recruitmentAutomationEnabled: false,
    recruitmentKeywords: [],
    recruitmentPrompt: "🎯 I'm impressed by your background! Let's discuss how you could be a great fit:",
    recruitmentDelay: 2,
    recruitmentAttachments: [],
    
    // AI Detection toggles for each automation
    postResponseAiEnabled: false,
    commentResponseAiEnabled: false,
    messageResponseAiEnabled: false,
    newConnectionDMAiEnabled: false,
    leadGenerationAiEnabled: false,
    jobPostingResponseAiEnabled: false,
    networkingOutreachAiEnabled: false,
    contentEngagementAiEnabled: false,
    eventPromotionAiEnabled: false,
    skillEndorsementAiEnabled: false,
    companyPageManagementAiEnabled: false,
    thoughtLeadershipAiEnabled: false,
    recruitmentAutomationAiEnabled: false
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        // Essential features test data
        postResponseEnabled: true,
        commentResponseEnabled: true,
        
        // Premium features test data
        messageResponseEnabled: true,
        messageKeywords: [
          { keyword: "collaboration", prompt: "🤝 I'd love to explore collaboration opportunities!", delay: 1 },
          { keyword: "partnership", prompt: "💼 Let's discuss potential partnerships!", delay: 2 }
        ],
        newConnectionDMEnabled: true,
        keywordTriggersEnabled: true,
        keywordTriggers: [
          { keyword: "hiring", prompt: "💼 I see you're hiring! I'd love to learn more about opportunities.", delay: 2 },
          { keyword: "networking", prompt: "🌐 Always excited to expand my professional network!", delay: 1 }
        ],
        leadGenerationEnabled: true,
        jobPostingResponseEnabled: true,
        networkingOutreachEnabled: true,
        contentEngagementEnabled: true,
        eventPromotionEnabled: true,
        skillEndorsementEnabled: true,
        companyPageManagementEnabled: true,
        thoughtLeadershipEnabled: true,
        recruitmentAutomationEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    const loadingToastId = toast.loading('Connecting to LinkedIn...', { duration: Infinity });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      toast.dismiss(loadingToastId);
      toast.success('💼 Successfully connected to LinkedIn!');
    } catch (error) {
      console.error('Failed to connect to LinkedIn:', error);
      toast.dismiss(loadingToastId);
      toast.error('❌ Failed to connect to LinkedIn. Please try again.');
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

  const reactionSections = [
    {
      id: 'postResponse',
      title: 'Respond to Posts',
      icon: <IconFileText className="w-5 h-5" />,
      description: 'Automatically respond to posts in your feed and network',
      enabled: settingsData.postResponseEnabled,
      prompt: settingsData.postResponsePrompt,
      delay: settingsData.postResponseDelay,
      color: 'blue',
      hasBasicSettings: true,
      tier: 'Essential'
    },
    {
      id: 'commentResponse',
      title: 'Respond to Comments',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Engage with comments on your posts and others\' content',
      enabled: settingsData.commentResponseEnabled,
      prompt: settingsData.commentResponsePrompt,
      delay: settingsData.commentResponseDelay,
      color: 'green',
      hasBasicSettings: true,
      tier: 'Essential'
    },
    {
      id: 'messageResponse',
      title: 'Respond to Messages',
      icon: <IconMail className="w-5 h-5" />,
      description: 'Auto-respond to direct messages and InMail',
      enabled: settingsData.messageResponseEnabled,
      keywords: settingsData.messageKeywords,
      keywordField: 'messageKeywords',
      prompt: settingsData.messagePrompt,
      delay: settingsData.messageDelay,
      color: 'purple',
      tier: 'Premium'
    },
    {
      id: 'newConnectionDM',
      title: 'DM New Connections',
      icon: <IconUserPlus className="w-5 h-5" />,
      description: 'Send welcome messages to new connections automatically',
      enabled: settingsData.newConnectionDMEnabled,
      keywords: settingsData.newConnectionKeywords,
      keywordField: 'newConnectionKeywords',
      prompt: settingsData.newConnectionPrompt,
      delay: settingsData.newConnectionDelay,
      color: 'indigo',
      tier: 'Premium'
    },
    {
      id: 'leadGeneration',
      title: 'Lead Generation Automation',
      icon: <IconTarget className="w-5 h-5" />,
      description: 'Identify and engage with potential leads automatically',
      enabled: settingsData.leadGenerationEnabled,
      keywords: settingsData.leadKeywords,
      keywordField: 'leadKeywords',
      prompt: settingsData.leadPrompt,
      delay: settingsData.leadDelay,
      color: 'orange',
      tier: 'Premium'
    },
    {
      id: 'jobPostingResponse',
      title: 'Job Posting Responses',
      icon: <IconBriefcase className="w-5 h-5" />,
      description: 'Automatically respond to relevant job postings',
      enabled: settingsData.jobPostingResponseEnabled,
      keywords: settingsData.jobKeywords,
      keywordField: 'jobKeywords',
      prompt: settingsData.jobPrompt,
      delay: settingsData.jobDelay,
      color: 'red',
      tier: 'Premium'
    },
    {
      id: 'networkingOutreach',
      title: 'Networking Outreach',
      icon: <IconNetwork className="w-5 h-5" />,
      description: 'Proactively reach out to expand your professional network',
      enabled: settingsData.networkingOutreachEnabled,
      keywords: settingsData.networkingKeywords,
      keywordField: 'networkingKeywords',
      prompt: settingsData.networkingPrompt,
      delay: settingsData.networkingDelay,
      color: 'pink',
      tier: 'Premium'
    },
    {
      id: 'contentEngagement',
      title: 'Content Engagement Boost',
      icon: <IconTrendingUp className="w-5 h-5" />,
      description: 'Automatically engage with trending content in your industry',
      enabled: settingsData.contentEngagementEnabled,
      keywords: settingsData.contentKeywords,
      keywordField: 'contentKeywords',
      prompt: settingsData.contentPrompt,
      delay: settingsData.contentDelay,
      color: 'teal',
      tier: 'Premium'
    },
    {
      id: 'eventPromotion',
      title: 'Event Promotion Assistant',
      icon: <IconCalendar className="w-5 h-5" />,
      description: 'Promote events and respond to event-related interactions',
      enabled: settingsData.eventPromotionEnabled,
      keywords: settingsData.eventKeywords,
      keywordField: 'eventKeywords',
      prompt: settingsData.eventPrompt,
      delay: settingsData.eventDelay,
      color: 'yellow',
      tier: 'Premium'
    },
    {
      id: 'skillEndorsement',
      title: 'Skill Endorsement Exchange',
      icon: <IconTrophy className="w-5 h-5" />,
      description: 'Automatically endorse skills and request endorsements',
      enabled: settingsData.skillEndorsementEnabled,
      keywords: settingsData.skillKeywords,
      keywordField: 'skillKeywords',
      prompt: settingsData.skillPrompt,
      delay: settingsData.skillDelay,
      color: 'emerald',
      tier: 'Premium'
    },
    {
      id: 'companyPageManagement',
      title: 'Company Page Management',
      icon: <IconBuilding className="w-5 h-5" />,
      description: 'Manage company page interactions and follower engagement',
      enabled: settingsData.companyPageManagementEnabled,
      keywords: settingsData.companyKeywords,
      keywordField: 'companyKeywords',
      prompt: settingsData.companyPrompt,
      delay: settingsData.companyDelay,
      color: 'rose',
      tier: 'Premium'
    },
    {
      id: 'thoughtLeadership',
      title: 'Thought Leadership Builder',
      icon: <IconBulb className="w-5 h-5" />,
      description: 'Build thought leadership through strategic content engagement',
      enabled: settingsData.thoughtLeadershipEnabled,
      keywords: settingsData.thoughtKeywords,
      keywordField: 'thoughtKeywords',
      prompt: settingsData.thoughtPrompt,
      delay: settingsData.thoughtDelay,
      color: 'cyan',
      tier: 'Premium'
    },
    {
      id: 'recruitmentAutomation',
      title: 'Recruitment Automation',
      icon: <IconUsers className="w-5 h-5" />,
      description: 'Automate recruitment processes and candidate outreach',
      enabled: settingsData.recruitmentAutomationEnabled,
      keywords: settingsData.recruitmentKeywords,
      keywordField: 'recruitmentKeywords',
      prompt: settingsData.recruitmentPrompt,
      delay: settingsData.recruitmentDelay,
      color: 'violet',
      tier: 'Premium'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: any } = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        switch: 'bg-blue-500',
        focus: 'focus:ring-blue-500 focus:border-blue-500'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        switch: 'bg-green-500',
        focus: 'focus:ring-green-500 focus:border-green-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        switch: 'bg-purple-500',
        focus: 'focus:ring-purple-500 focus:border-purple-500'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        switch: 'bg-indigo-500',
        focus: 'focus:ring-indigo-500 focus:border-indigo-500'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        switch: 'bg-orange-500',
        focus: 'focus:ring-orange-500 focus:border-orange-500'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        switch: 'bg-red-500',
        focus: 'focus:ring-red-500 focus:border-red-500'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-700',
        switch: 'bg-pink-500',
        focus: 'focus:ring-pink-500 focus:border-pink-500'
      },
      teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        switch: 'bg-teal-500',
        focus: 'focus:ring-teal-500 focus:border-teal-500'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        switch: 'bg-yellow-500',
        focus: 'focus:ring-yellow-500 focus:border-yellow-500'
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        switch: 'bg-emerald-500',
        focus: 'focus:ring-emerald-500 focus:border-emerald-500'
      },
      rose: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        switch: 'bg-rose-500',
        focus: 'focus:ring-rose-500 focus:border-rose-500'
      },
      cyan: {
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-700',
        switch: 'bg-cyan-500',
        focus: 'focus:ring-cyan-500 focus:border-cyan-500'
      },
      violet: {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-700',
        switch: 'bg-violet-500',
        focus: 'focus:ring-violet-500 focus:border-violet-500'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getDefaultPromptPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      postResponse: "💼 Thanks for sharing this insightful post!",
      commentResponse: "👍 Great comment! I appreciate your perspective.",
      messageResponse: "📩 Thanks for reaching out! I'm excited to connect.",
      newConnectionDM: "🤝 Welcome to my network! I'm thrilled to connect.",
      leadGeneration: "🎯 I see you're interested in our solutions!",
      jobPostingResponse: "💼 Exciting opportunity! I'd love to learn more.",
      networkingOutreach: "🌐 I'd love to expand our professional network!",
      contentEngagement: "📝 Fantastic content! This really resonates.",
      eventPromotion: "🎉 Exciting event! I'd love to attend.",
      skillEndorsement: "⭐ I'd be happy to endorse your skills!",
      companyPageManagement: "🏢 Thanks for following our company page!",
      thoughtLeadership: "💡 Thought-provoking insights!",
      recruitmentAutomation: "🎯 I'm impressed by your background!"
    };
    return placeholders[sectionId] || "Enter your custom response message...";
  };

  const getKeywordExamples = (sectionId: string) => {
    const examples: { [key: string]: string } = {
      messageResponse: "collaboration, partnership, opportunity, meeting",
      newConnectionDM: "connect, network, introduction, referral",
      leadGeneration: "interested, solution, demo, pricing, consultation",
      jobPostingResponse: "hiring, position, role, opportunity, career",
      networkingOutreach: "networking, connect, collaborate, partnership",
      contentEngagement: "insights, thoughts, opinion, experience, expertise",
      eventPromotion: "event, conference, webinar, workshop, meetup",
      skillEndorsement: "skills, expertise, endorse, recommend, talent",
      companyPageManagement: "company, business, services, products, team",
      thoughtLeadership: "industry, trends, innovation, leadership, strategy",
      recruitmentAutomation: "candidate, resume, experience, qualifications"
    };
    return examples[sectionId] || "keyword1, keyword2, keyword3";
  };

  const getKeywordPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      messageResponse: "collaboration",
      newConnectionDM: "connect",
      leadGeneration: "interested",
      jobPostingResponse: "hiring",
      networkingOutreach: "networking",
      contentEngagement: "insights",
      eventPromotion: "event",
      skillEndorsement: "skills",
      companyPageManagement: "company",
      thoughtLeadership: "industry",
      recruitmentAutomation: "candidate"
    };
    return placeholders[sectionId] || "keyword";
  };

  const handleFileUpload = async (files: FileList, field: string) => {
    const maxFileSize = 100 * 1024 * 1024; // 100MB limit for LinkedIn
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
    
    const validFiles: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxFileSize) {
        toast.error(`❌ File "${file.name}" is too large. Max size is 100MB.`);
        continue;
      }
      
      // Check file type
      const isValidType = allowedTypes.some(type => file.type.startsWith(type));
      if (!isValidType) {
        toast.error(`❌ File "${file.name}" is not supported. Use images, videos, audio, or PDFs.`);
        continue;
      }
      
      // Create file attachment object
      const attachment: FileAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'pdf',
        url: URL.createObjectURL(file),
        size: file.size
      };
      
      validFiles.push(attachment);
    }
    
    if (validFiles.length > 0) {
      setSettingsData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), ...validFiles]
      }));
      toast.success(`✅ ${validFiles.length} file(s) uploaded successfully!`);
    }
  };

  const removeAttachment = (field: string, attachmentId: string) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((att: FileAttachment) => att.id !== attachmentId)
    }));
    toast.success('🗑️ File removed');
  };

  const addKeywordAttachment = (field: string, keywordIndex: number, files: FileList) => {
    const maxFileSize = 100 * 1024 * 1024;
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
    
    const validFiles: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxFileSize) {
        toast.error(`❌ File "${file.name}" is too large. Max size is 100MB.`);
        continue;
      }
      
      const isValidType = allowedTypes.some(type => file.type.startsWith(type));
      if (!isValidType) {
        toast.error(`❌ File "${file.name}" is not supported.`);
        continue;
      }
      
      const attachment: FileAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'pdf',
        url: URL.createObjectURL(file),
        size: file.size
      };
      
      validFiles.push(attachment);
    }
    
    if (validFiles.length > 0) {
      const newTriggers = [...(settingsData[field] || [])];
      newTriggers[keywordIndex].attachments = [...(newTriggers[keywordIndex].attachments || []), ...validFiles];
      setSettingsData({ ...settingsData, [field]: newTriggers });
      toast.success(`✅ ${validFiles.length} file(s) attached to keyword!`);
    }
  };

  const removeKeywordAttachment = (field: string, keywordIndex: number, attachmentId: string) => {
    const newTriggers = [...(settingsData[field] || [])];
    newTriggers[keywordIndex].attachments = (newTriggers[keywordIndex].attachments || []).filter((att: FileAttachment) => att.id !== attachmentId);
    setSettingsData({ ...settingsData, [field]: newTriggers });
    toast.success('🗑️ File removed from keyword');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <IconPhoto className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <IconVideo className="w-4 h-4 text-purple-500" />;
      case 'audio':
        return <IconHeadphones className="w-4 h-4 text-green-500" />;
      case 'pdf':
        return <IconFileText className="w-4 h-4 text-red-500" />;
      default:
        return <IconFileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">LinkedIn Not Connected</p>
                <p className="text-xs text-orange-600">Connect your LinkedIn account to enable these powerful professional automation features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
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
                {isConnecting ? "Connecting..." : "Connect LinkedIn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandLinkedin className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">LinkedIn Professional Automation</h1>
              <p className="mt-1 text-white/80">13 intelligent automations to supercharge your professional networking and business growth</p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Connected
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto ${!canInteract ? 'opacity-60' : ''}`}>
        {/* Essential LinkedIn Automations */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Essential LinkedIn Automations</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">2 Automations</span>
          </div>

          {reactionSections.filter(section => section.tier === 'Essential').map((section) => {
            const colors = getColorClasses(section.color);
            const fieldName = section.keywordField;
            
            return (
              <div key={section.id} className={`bg-white rounded-lg border ${colors.border} overflow-hidden`}>
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
                          <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-2`}>
                            {section.title}
                            <span className={`px-2 py-1 text-xs rounded-full ${section.tier === 'Essential' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {section.tier}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={settingsData[`${section.id}AiEnabled`]}
                          onChange={(enabled) => handleAiToggle(section.title, `${section.id}AiEnabled`, enabled)}
                          disabled={!section.enabled || !canInteract}
                          className={`${settingsData[`${section.id}AiEnabled`] ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50`}
                        >
                          <span className={`${settingsData[`${section.id}AiEnabled`] ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                        </Switch>
                        <span className="text-xs text-gray-600">AI Intent Detection</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 space-y-4 ${!section.enabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                      <h4 className="font-medium text-gray-700">Response Settings</h4>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-2">
                        <strong>When used:</strong> This automation will trigger when {section.id === 'postResponse' ? 'posts appear in your feed' : 'comments are made on posts you\'re following'}
                      </p>
                      <p className="text-xs text-blue-600">
                        💡 <strong>How it works:</strong> AI analyzes content relevance and responds professionally to build your network
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          rows={3}
                          value={section.prompt}
                          onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}Prompt`]: e.target.value })}
                          placeholder={getDefaultPromptPlaceholder(section.id)}
                        />
                        <p className="text-xs text-gray-500 mt-1">This message will be used for {section.id === 'postResponse' ? 'post responses' : 'comment replies'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Response Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                          value={section.delay}
                          onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}Delay`]: Number(e.target.value) })}
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">0 = instant response, higher = more natural delay</p>
                      </div>
                    </div>

                    {/* File Attachments */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">Attachments</label>
                        <label className={`flex items-center gap-2 px-3 py-1 text-sm ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}>
                          <IconPaperclip className="w-4 h-4" />
                          Add Files
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*,audio/*,.pdf"
                            className="hidden"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, `${section.id}Attachments`)}
                          />
                        </label>
                      </div>
                      
                      {/* Drag and drop area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <IconUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Drag & drop files here, or click "Add Files"</p>
                        <p className="text-xs text-gray-500">Supports: Images, Videos, Audio, PDFs • Max 100MB per file</p>
                      </div>

                      {/* Attached Files List */}
                      {(settingsData[`${section.id}Attachments`] || []).length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Attached Files ({(settingsData[`${section.id}Attachments`] || []).length})</h5>
                          <div className="space-y-2">
                            {(settingsData[`${section.id}Attachments`] || []).map((attachment: FileAttachment) => (
                              <div key={attachment.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center gap-3">
                                  {getFileIcon(attachment.type)}
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
              </div>
            );
          })}
        </div>

        {/* Premium LinkedIn Automations */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Premium LinkedIn Automations</h2>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">11 Automations</span>
          </div>

          {reactionSections.filter(section => section.tier === 'Premium').map((section) => {
            const colors = getColorClasses(section.color);
            const fieldName = section.keywordField;
            
            return (
              <div key={section.id} className={`bg-white rounded-lg border ${colors.border} overflow-hidden`}>
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
                          <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-2`}>
                            {section.title}
                            <span className={`px-2 py-1 text-xs rounded-full ${section.tier === 'Essential' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {section.tier}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={settingsData[`${section.id}AiEnabled`]}
                          onChange={(enabled) => handleAiToggle(section.title, `${section.id}AiEnabled`, enabled)}
                          disabled={!section.enabled || !canInteract}
                          className={`${settingsData[`${section.id}AiEnabled`] ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50`}
                        >
                          <span className={`${settingsData[`${section.id}AiEnabled`] ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                        </Switch>
                        <span className="text-xs text-gray-600">AI Intent Detection</span>
                      </div>
                      {fieldName && (
                        <button
                          onClick={() => addKeywordTrigger(fieldName)}
                          disabled={!section.enabled || !canInteract}
                          className={`flex items-center gap-2 px-3 py-1 ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                        >
                          <IconPlus className="w-4 h-4" />
                          Add Keyword
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-4 space-y-4 ${!section.enabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                      <h4 className="font-medium text-gray-700">Default Response Settings</h4>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-700 mb-2">
                        <strong>When used:</strong> When no specific keyword triggers match, this default response will be sent
                      </p>
                      <p className="text-xs text-purple-600">
                        💡 <strong>How it works:</strong> Professional interactions are analyzed for intent, and this automation responds when relevant
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Response Message</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          rows={3}
                          value={section.prompt}
                          onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}Prompt`]: e.target.value })}
                          placeholder={getDefaultPromptPlaceholder(section.id)}
                        />
                        <p className="text-xs text-gray-500 mt-1">This message will be sent when the automation triggers</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Response Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                          value={section.delay}
                          onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}Delay`]: Number(e.target.value) })}
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">0 = instant response, higher = more natural delay</p>
                      </div>
                    </div>

                    {/* File Attachments */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">Default Attachments</label>
                        <label className={`flex items-center gap-2 px-3 py-1 text-sm ${colors.switch} text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}>
                          <IconPaperclip className="w-4 h-4" />
                          Add Files
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*,audio/*,.pdf"
                            className="hidden"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, `${section.id}Attachments`)}
                          />
                        </label>
                      </div>
                      
                      {/* Drag and drop area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <IconUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Drag & drop files here, or click "Add Files"</p>
                        <p className="text-xs text-gray-500">Supports: Images, Videos, Audio, PDFs • Max 100MB per file</p>
                      </div>

                      {/* Attached Files List */}
                      {(settingsData[`${section.id}Attachments`] || []).length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Attached Files ({(settingsData[`${section.id}Attachments`] || []).length})</h5>
                          <div className="space-y-2">
                            {(settingsData[`${section.id}Attachments`] || []).map((attachment: FileAttachment) => (
                              <div key={attachment.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center gap-3">
                                  {getFileIcon(attachment.type)}
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

                  {/* Keyword Triggers */}
                  {fieldName && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
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
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-700 mb-2">
                          <strong>When used:</strong> When professional interactions contain these exact keywords/phrases (takes priority over default response)
                        </p>
                        <p className="text-xs text-purple-600">
                          💡 <strong>Examples for {section.title}:</strong> {getKeywordExamples(section.id)}
                        </p>
                      </div>

                      {(section.keywords || []).length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                          <div className="flex flex-col items-center gap-2">
                            {section.icon}
                            <p>No keyword triggers configured</p>
                            <p className="text-xs">Add specific keywords for more targeted professional responses</p>
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
                                      accept="image/*,video/*,audio/*,.pdf"
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
                                            {getFileIcon(attachment.type)}
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
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-blue-200">
          <button 
            disabled={!canInteract}
            onClick={() => {
              toast.success('💾 LinkedIn automation settings saved successfully!');
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Automation Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInReactions; 