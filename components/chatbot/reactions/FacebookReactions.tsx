"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandFacebook, IconPlus, IconTrash, IconAlertTriangle, IconTestPipe, IconGift, IconCalendar, IconShoppingCart, IconStar, IconMapPin, IconMessageCircle, IconTrendingUp, IconUsers, IconHeart, IconBulb, IconPaperclip, IconPhoto, IconFileText, IconX, IconUpload } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

interface FacebookReactionsProps {
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
  welcomeDmPrompt: string;
  welcomeDmDelay: number;
  commentDmPrompt: string;
  commentDmDelay: number;
  keywordDmEnabled: boolean;
  keywordTriggers: KeywordTrigger[];
  likeDmEnabled: boolean;
  likeDmPrompt: string;
  likeDmDelay: number;
  likeDmFirstOnly: boolean;
  likeDmSpecificPosts: { postUrl: string; prompt: string; delay: number }[];
  shareDmEnabled: boolean;
  shareDmPrompt: string;
  shareDmDelay: number;
  shareDmFirstOnly: boolean;
  shareDmSpecificPosts: { postUrl: string; prompt: string; delay: number }[];
  
  // Lead Magnet Automation
  leadMagnetEnabled: boolean;
  leadMagnetKeywords: KeywordTrigger[];
  leadMagnetPrompt: string;
  leadMagnetDelay: number;
  leadMagnetAttachments: FileAttachment[];
  
  // Event Registration DMs
  eventRegistrationEnabled: boolean;
  eventKeywords: KeywordTrigger[];
  eventPrompt: string;
  eventDelay: number;
  eventRegistrationAttachments: FileAttachment[];
  
  // Product Inquiry Responses
  productInquiryEnabled: boolean;
  productKeywords: KeywordTrigger[];
  productPrompt: string;
  productDelay: number;
  productInquiryAttachments: FileAttachment[];
  
  // Customer Support Escalation
  supportEscalationEnabled: boolean;
  negativeKeywords: KeywordTrigger[];
  supportPrompt: string;
  supportDelay: number;
  supportEscalationAttachments: FileAttachment[];
  
  // Contest/Giveaway Management
  contestEnabled: boolean;
  contestKeywords: KeywordTrigger[];
  contestPrompt: string;
  contestDelay: number;
  contestAttachments: FileAttachment[];
  
  // Appointment Booking
  appointmentEnabled: boolean;
  appointmentKeywords: KeywordTrigger[];
  appointmentPrompt: string;
  appointmentDelay: number;
  appointmentAttachments: FileAttachment[];
  
  // Abandoned Cart Recovery
  cartRecoveryEnabled: boolean;
  cartKeywords: KeywordTrigger[];
  cartPrompt: string;
  cartDelay: number;
  cartRecoveryAttachments: FileAttachment[];
  
  // VIP Customer Recognition
  vipRecognitionEnabled: boolean;
  vipKeywords: KeywordTrigger[];
  vipPrompt: string;
  vipDelay: number;
  vipRecognitionAttachments: FileAttachment[];
  
  // Local Business Promotions
  localPromotionEnabled: boolean;
  localKeywords: KeywordTrigger[];
  localPrompt: string;
  localDelay: number;
  localPromotionAttachments: FileAttachment[];
  
  // Testimonial Collection
  testimonialEnabled: boolean;
  testimonialKeywords: KeywordTrigger[];
  testimonialPrompt: string;
  testimonialDelay: number;
  testimonialAttachments: FileAttachment[];
  
  // AI Detection toggles for each automation
  leadMagnetAiEnabled: boolean;
  eventRegistrationAiEnabled: boolean;
  productInquiryAiEnabled: boolean;
  supportEscalationAiEnabled: boolean;
  contestAiEnabled: boolean;
  appointmentAiEnabled: boolean;
  cartRecoveryAiEnabled: boolean;
  vipRecognitionAiEnabled: boolean;
  localPromotionAiEnabled: boolean;
  testimonialAiEnabled: boolean;
  
  // Allow dynamic property access
  [key: string]: any;
}

const FacebookReactions = ({ chatbot }: FacebookReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    // Original reactions - keeping these
    commentDmEnabled: false,
    welcomeDmPrompt: "Welcome! Thanks for engaging with our post. How can I help you today?",
    welcomeDmDelay: 0,
    commentDmPrompt: "Thanks for your comment! I'd love to continue this conversation in Messenger.",
    commentDmDelay: 0,
    keywordDmEnabled: false,
    keywordTriggers: [],
    likeDmEnabled: false,
    likeDmPrompt: "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?",
    likeDmDelay: 0,
    likeDmFirstOnly: false,
    likeDmSpecificPosts: [],
    shareDmEnabled: false,
    shareDmPrompt: "Thanks for sharing our post! We appreciate your support. How can we help you today?",
    shareDmDelay: 0,
    shareDmFirstOnly: false,
    shareDmSpecificPosts: [],
    
    // Lead Magnet Automation
    leadMagnetEnabled: false,
    leadMagnetKeywords: [],
    leadMagnetPrompt: "🎁 Thanks for your interest! I'd love to send you our free guide. Check your DMs!",
    leadMagnetDelay: 1,
    leadMagnetAttachments: [],
    
    // Event Registration DMs
    eventRegistrationEnabled: false,
    eventKeywords: [],
    eventPrompt: "🎉 Excited you're interested in our event! Here are the details and registration link:",
    eventDelay: 2,
    eventRegistrationAttachments: [],
    
    // Product Inquiry Responses
    productInquiryEnabled: false,
    productKeywords: [],
    productPrompt: "💡 Great question about our products! Let me send you detailed information and pricing:",
    productDelay: 1,
    productInquiryAttachments: [],
    
    // Customer Support Escalation
    supportEscalationEnabled: false,
    negativeKeywords: [],
    supportPrompt: "We're sorry to hear about your experience. Let's resolve this privately - I'm sending you our support contact:",
    supportDelay: 0,
    supportEscalationAttachments: [],
    
    // Contest/Giveaway Management
    contestEnabled: false,
    contestKeywords: [],
    contestPrompt: "🏆 Thanks for entering our giveaway! Here are the official rules and entry confirmation:",
    contestDelay: 1,
    contestAttachments: [],
    
    // Appointment Booking
    appointmentEnabled: false,
    appointmentKeywords: [],
    appointmentPrompt: "📅 Ready to schedule? Here's my calendar link to book your preferred time:",
    appointmentDelay: 2,
    appointmentAttachments: [],
    
    // Abandoned Cart Recovery
    cartRecoveryEnabled: false,
    cartKeywords: [],
    cartPrompt: "🛒 Still thinking about your purchase? Here's a special 10% discount to complete your order:",
    cartDelay: 5,
    cartRecoveryAttachments: [],
    
    // VIP Customer Recognition
    vipRecognitionEnabled: false,
    vipKeywords: [],
    vipPrompt: "⭐ As one of our valued customers, here's an exclusive offer just for you:",
    vipDelay: 1,
    vipRecognitionAttachments: [],
    
    // Local Business Promotions
    localPromotionEnabled: false,
    localKeywords: [],
    localPrompt: "📍 Come visit us! Here's our location, hours, and a special in-store offer:",
    localDelay: 2,
    localPromotionAttachments: [],
    
    // Testimonial Collection
    testimonialEnabled: false,
    testimonialKeywords: [],
    testimonialPrompt: "🙏 So glad you had a great experience! Would you mind sharing a quick review?",
    testimonialDelay: 3,
    testimonialAttachments: [],
    
    // AI Detection toggles for each automation
    leadMagnetAiEnabled: false,
    eventRegistrationAiEnabled: false,
    productInquiryAiEnabled: false,
    supportEscalationAiEnabled: false,
    contestAiEnabled: false,
    appointmentAiEnabled: false,
    cartRecoveryAiEnabled: false,
    vipRecognitionAiEnabled: false,
    localPromotionAiEnabled: false,
    testimonialAiEnabled: false
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        // Original reactions test data
        commentDmEnabled: true,
        keywordDmEnabled: true,
        keywordTriggers: [
          { keyword: "help", prompt: "I see you need help! Let me assist you with that.", delay: 2 },
          { keyword: "pricing", prompt: "Great question about pricing! Let me share our current rates with you.", delay: 1 }
        ],
        likeDmEnabled: true,
        shareDmEnabled: true,
        
        // New automations test data
        leadMagnetEnabled: true,
        leadMagnetKeywords: [
          { keyword: "free guide", prompt: "🎁 Here's your free marketing guide! Download link: [LINK]", delay: 1 },
          { keyword: "discount", prompt: "💰 Use code SAVE20 for 20% off your first order!", delay: 1 }
        ],
        eventRegistrationEnabled: true,
        eventKeywords: [
          { keyword: "webinar", prompt: "🎉 Join our free webinar! Register here: [LINK]", delay: 2 }
        ],
        productInquiryEnabled: true,
        productKeywords: [
          { keyword: "pricing", prompt: "💡 Here's our pricing guide and product comparison: [LINK]", delay: 1 }
        ],
        supportEscalationEnabled: true,
        negativeKeywords: [
          { keyword: "problem", prompt: "We're here to help! Our support team will contact you within 1 hour.", delay: 0 }
        ],
        contestEnabled: true,
        appointmentEnabled: true,
        cartRecoveryEnabled: true,
        vipRecognitionEnabled: true,
        localPromotionEnabled: true,
        testimonialEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Facebook:', error);
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

  const addSpecificPost = (type: 'like' | 'share') => {
    const field = type === 'like' ? 'likeDmSpecificPosts' : 'shareDmSpecificPosts';
    setSettingsData({
      ...settingsData,
      [field]: [...(settingsData[field] || []), { postUrl: "", prompt: "", delay: 0 }]
    });
  };

  const removeSpecificPost = (index: number, type: 'like' | 'share') => {
    const field = type === 'like' ? 'likeDmSpecificPosts' : 'shareDmSpecificPosts';
    const newPosts = [...(settingsData[field] || [])];
    newPosts.splice(index, 1);
    setSettingsData({ ...settingsData, [field]: newPosts });
  };

  // Original reaction sections - restyled to match new design
  const originalReactionSections = [
    {
      id: 'commentDm',
      title: 'Comment-Triggered DMs',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Send automated DMs when users comment on your posts',
      enabled: settingsData.commentDmEnabled,
      color: 'blue',
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
      color: 'pink',
      hasSpecificPosts: true,
      specificPosts: settingsData.likeDmSpecificPosts,
      prompt: settingsData.likeDmPrompt,
      delay: settingsData.likeDmDelay,
      firstOnly: settingsData.likeDmFirstOnly
    },
    {
      id: 'shareDm',
      title: 'Share DMs',
      icon: <IconTrendingUp className="w-5 h-5" />,
      description: 'Send DMs when users share your posts',
      enabled: settingsData.shareDmEnabled,
      color: 'green',
      hasSpecificPosts: true,
      specificPosts: settingsData.shareDmSpecificPosts,
      prompt: settingsData.shareDmPrompt,
      delay: settingsData.shareDmDelay,
      firstOnly: settingsData.shareDmFirstOnly
    }
  ];

  const reactionSections = [
    {
      id: 'leadMagnet',
      title: 'Lead Magnet Automation',
      icon: <IconGift className="w-5 h-5" />,
      description: 'Auto-send lead magnets when users comment specific keywords',
      enabled: settingsData.leadMagnetEnabled,
      keywords: settingsData.leadMagnetKeywords,
      prompt: settingsData.leadMagnetPrompt,
      delay: settingsData.leadMagnetDelay,
      color: 'blue'
    },
    {
      id: 'eventRegistration',
      title: 'Event Registration DMs',
      icon: <IconCalendar className="w-5 h-5" />,
      description: 'Auto-send event details and registration links',
      enabled: settingsData.eventRegistrationEnabled,
      keywords: settingsData.eventKeywords,
      prompt: settingsData.eventPrompt,
      delay: settingsData.eventDelay,
      color: 'purple'
    },
    {
      id: 'productInquiry',
      title: 'Product Inquiry Responses',
      icon: <IconBulb className="w-5 h-5" />,
      description: 'Auto-respond to product questions with detailed info',
      enabled: settingsData.productInquiryEnabled,
      keywords: settingsData.productKeywords,
      prompt: settingsData.productPrompt,
      delay: settingsData.productDelay,
      color: 'green'
    },
    {
      id: 'supportEscalation',
      title: 'Customer Support Escalation',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Auto-detect negative sentiment and escalate to support',
      enabled: settingsData.supportEscalationEnabled,
      keywords: settingsData.negativeKeywords,
      prompt: settingsData.supportPrompt,
      delay: settingsData.supportDelay,
      color: 'red'
    },
    {
      id: 'contest',
      title: 'Contest/Giveaway Management',
      icon: <IconTrendingUp className="w-5 h-5" />,
      description: 'Auto-manage contest entries and send rules',
      enabled: settingsData.contestEnabled,
      keywords: settingsData.contestKeywords,
      prompt: settingsData.contestPrompt,
      delay: settingsData.contestDelay,
      color: 'yellow'
    },
    {
      id: 'appointment',
      title: 'Appointment Booking',
      icon: <IconCalendar className="w-5 h-5" />,
      description: 'Auto-send calendar booking links for services',
      enabled: settingsData.appointmentEnabled,
      keywords: settingsData.appointmentKeywords,
      prompt: settingsData.appointmentPrompt,
      delay: settingsData.appointmentDelay,
      color: 'indigo'
    },
    {
      id: 'cartRecovery',
      title: 'Abandoned Cart Recovery',
      icon: <IconShoppingCart className="w-5 h-5" />,
      description: 'Re-engage users who showed interest but didn\'t purchase',
      enabled: settingsData.cartRecoveryEnabled,
      keywords: settingsData.cartKeywords,
      prompt: settingsData.cartPrompt,
      delay: settingsData.cartDelay,
      color: 'orange'
    },
    {
      id: 'vipRecognition',
      title: 'VIP Customer Recognition',
      icon: <IconStar className="w-5 h-5" />,
      description: 'Auto-recognize and reward loyal customers',
      enabled: settingsData.vipRecognitionEnabled,
      keywords: settingsData.vipKeywords,
      prompt: settingsData.vipPrompt,
      delay: settingsData.vipDelay,
      color: 'pink'
    },
    {
      id: 'localPromotion',
      title: 'Local Business Promotions',
      icon: <IconMapPin className="w-5 h-5" />,
      description: 'Drive foot traffic with location-based offers',
      enabled: settingsData.localPromotionEnabled,
      keywords: settingsData.localKeywords,
      prompt: settingsData.localPrompt,
      delay: settingsData.localDelay,
      color: 'teal'
    },
    {
      id: 'testimonial',
      title: 'Testimonial Collection',
      icon: <IconHeart className="w-5 h-5" />,
      description: 'Auto-request reviews from satisfied customers',
      enabled: settingsData.testimonialEnabled,
      keywords: settingsData.testimonialKeywords,
      prompt: settingsData.testimonialPrompt,
      delay: settingsData.testimonialDelay,
      color: 'rose'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string; switch: string; focus: string } } = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', switch: 'bg-blue-500', focus: 'focus:ring-blue-500 focus:border-blue-500' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', switch: 'bg-purple-500', focus: 'focus:ring-purple-500 focus:border-purple-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', switch: 'bg-green-500', focus: 'focus:ring-green-500 focus:border-green-500' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', switch: 'bg-red-500', focus: 'focus:ring-red-500 focus:border-red-500' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', switch: 'bg-yellow-500', focus: 'focus:ring-yellow-500 focus:border-yellow-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', switch: 'bg-indigo-500', focus: 'focus:ring-indigo-500 focus:border-indigo-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', switch: 'bg-orange-500', focus: 'focus:ring-orange-500 focus:border-orange-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', switch: 'bg-pink-500', focus: 'focus:ring-pink-500 focus:border-pink-500' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', switch: 'bg-teal-500', focus: 'focus:ring-teal-500 focus:border-teal-500' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', switch: 'bg-rose-500', focus: 'focus:ring-rose-500 focus:border-rose-500' }
    };
    return colors[color] || colors.blue;
  };

  const getDefaultPromptPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      leadMagnet: "🎁 Thanks for your interest! I'd love to send you our free guide. Check your DMs!",
      eventRegistration: "🎉 Excited you're interested in our event! Here are the details and registration link:",
      productInquiry: "💡 Great question about our products! Let me send you detailed information and pricing:",
      supportEscalation: "We're sorry to hear about your experience. Let's resolve this privately - I'm sending you our support contact:",
      contest: "🏆 Thanks for entering our giveaway! Here are the official rules and entry confirmation:",
      appointment: "📅 Ready to schedule? Here's my calendar link to book your preferred time:",
      cartRecovery: "🛒 Still thinking about your purchase? Here's a special 10% discount to complete your order:",
      vipRecognition: "⭐ As one of our valued customers, here's an exclusive offer just for you:",
      localPromotion: "📍 Come visit us! Here's our location, hours, and a special in-store offer:",
      testimonial: "🙏 So glad you had a great experience! Would you mind sharing a quick review?"
    };
    return placeholders[sectionId] || "Enter your default response message...";
  };

  const getKeywordExamples = (sectionId: string) => {
    const examples: { [key: string]: string } = {
      leadMagnet: '"free guide", "download", "ebook", "checklist", "template"',
      eventRegistration: '"webinar", "event", "register", "sign up", "attend"',
      productInquiry: '"pricing", "cost", "how much", "features", "demo"',
      supportEscalation: '"problem", "issue", "complaint", "not working", "help"',
      contest: '"enter", "giveaway", "contest", "win", "prize"',
      appointment: '"book", "schedule", "appointment", "meeting", "consultation"',
      cartRecovery: '"cart", "checkout", "buy", "purchase", "order"',
      vipRecognition: '"loyal", "vip", "premium", "exclusive", "member"',
      localPromotion: '"location", "address", "visit", "store", "hours"',
      testimonial: '"review", "testimonial", "feedback", "experience", "recommend"'
    };
    return examples[sectionId] || '"keyword1", "keyword2", "phrase"';
  };

  const getKeywordPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      leadMagnet: "free guide",
      eventRegistration: "webinar",
      productInquiry: "pricing",
      supportEscalation: "problem",
      contest: "enter",
      appointment: "book",
      cartRecovery: "cart",
      vipRecognition: "vip",
      localPromotion: "location",
      testimonial: "review"
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
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">Facebook Not Connected</p>
                <p className="text-xs text-orange-600">Connect your Facebook page to enable these powerful automation features</p>
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
                {isConnecting ? "Connecting..." : "Connect Facebook"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandFacebook className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">Facebook Business Automation</h1>
              <p className="mt-1 text-white/80">10 powerful automations to convert social engagement into business results</p>
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
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Essential</span>
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
                        onClick={() => addSpecificPost(section.id === 'likeDm' ? 'like' : 'share')}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Welcome DM Template</label>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                          rows={3}
                          value={settingsData.welcomeDmPrompt}
                          onChange={(e) => setSettingsData({ ...settingsData, welcomeDmPrompt: e.target.value })}
                          placeholder="Enter welcome message for new users..."
                        />
                      </div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.welcomeDmDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, welcomeDmDelay: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment Delay (seconds)</label>
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                          value={settingsData.commentDmDelay}
                          onChange={(e) => setSettingsData({ ...settingsData, commentDmDelay: Number(e.target.value) })}
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
                                    onChange={(e) => updateKeywordTrigger('keywordTriggers', index, 'keyword', e.target.value)}
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
                                    onChange={(e) => updateKeywordTrigger('keywordTriggers', index, 'prompt', e.target.value)}
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
                                    onChange={(e) => updateKeywordTrigger('keywordTriggers', index, 'delay', Number(e.target.value))}
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

                  {/* Like/Share DM specific settings */}
                  {(section.id === 'likeDm' || section.id === 'shareDm') && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default DM Template</label>
                          <textarea
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus} resize-none`}
                            rows={3}
                            value={section.prompt}
                            onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}Prompt`]: e.target.value })}
                            placeholder={`Enter default message for ${section.title.toLowerCase()}...`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Delay (seconds)</label>
                          <input
                            type="number"
                            className={`w-full border border-gray-300 rounded-lg p-3 ${colors.focus}`}
                            value={section.delay}
                            onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}Delay`]: Number(e.target.value) })}
                          />
                          <div className="mt-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={section.firstOnly}
                                onChange={(e) => setSettingsData({ ...settingsData, [`${section.id}FirstOnly`]: e.target.checked })}
                                className={`rounded border-gray-300 ${colors.switch} focus:ring-2 ${colors.focus}`}
                              />
                              <span className="text-sm text-gray-700">Send DM only on first {section.id === 'likeDm' ? 'like' : 'share'}</span>
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
                                  onClick={() => removeSpecificPost(index, section.id === 'likeDm' ? 'like' : 'share')}
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
                                      const field = section.id === 'likeDm' ? 'likeDmSpecificPosts' : 'shareDmSpecificPosts';
                                      const newPosts = [...(settingsData[field] || [])];
                                      newPosts[index].postUrl = e.target.value;
                                      setSettingsData({ ...settingsData, [field]: newPosts });
                                    }}
                                    placeholder="https://facebook.com/..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                                  <input
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-lg p-2 ${colors.focus}`}
                                    value={post.prompt}
                                    onChange={(e) => {
                                      const field = section.id === 'likeDm' ? 'likeDmSpecificPosts' : 'shareDmSpecificPosts';
                                      const newPosts = [...(settingsData[field] || [])];
                                      newPosts[index].prompt = e.target.value;
                                      setSettingsData({ ...settingsData, [field]: newPosts });
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
                                      const field = section.id === 'likeDm' ? 'likeDmSpecificPosts' : 'shareDmSpecificPosts';
                                      const newPosts = [...(settingsData[field] || [])];
                                      newPosts[index].delay = Number(e.target.value);
                                      setSettingsData({ ...settingsData, [field]: newPosts });
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

        {/* Advanced Automations Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Advanced Business Automations</h2>
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
                      <p><strong>Step 1:</strong> User comments on your Facebook post</p>
                      <p><strong>Step 2:</strong> We analyze their comment for keywords/intent</p>
                      <p><strong>Step 3:</strong> Send appropriate response:</p>
                      <ul className="ml-4 space-y-1">
                        <li>• <strong>Keyword match found</strong> → Send custom keyword response</li>
                        <li>• <strong>No keyword match</strong> → Send default response (if enabled)</li>
                        <li>• <strong>AI detection</strong> → Use AI to detect {section.title.toLowerCase()} intent</li>
                      </ul>
                    </div>
                  </div>

                  {/* AI Detection Toggle */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                        className={`${settingsData[`${section.id}AiEnabled`] ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
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
        <div className="flex justify-end pt-4 border-t border-blue-200">
          <button 
            disabled={!canInteract}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Automation Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacebookReactions;
