"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandWhatsapp, IconLoader, IconTrash, IconPlus, IconAlertTriangle, IconTestPipe, IconPhoto, IconVideo, IconUsers, IconHeart, IconMessageCircle, IconStar, IconGift, IconTrendingUp, IconShoppingCart, IconMapPin, IconCalendar, IconBulb, IconPaperclip, IconFileText, IconX, IconUpload, IconEye, IconUserPlus, IconRepeat, IconShare, IconTarget, IconCrown, IconRocket, IconPhone, IconMail, IconClock, IconBell, IconSettings, IconChartBar, IconTag, IconCreditCard, IconTruck, IconHeadphones, IconThumbUp, IconSend } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

interface WhatsAppReactionsProps {
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
  // Default Response (Essential)
  defaultResponseEnabled: boolean;
  defaultResponsePrompt: string;
  defaultResponseDelay: number;
  defaultResponseAttachments: FileAttachment[];
  
  // Core WhatsApp Business Features
  welcomeMessageEnabled: boolean;
  welcomeMessagePrompt: string;
  welcomeMessageDelay: number;
  welcomeMessageAttachments: FileAttachment[];
  
  // Smart Keyword Responses
  keywordResponsesEnabled: boolean;
  keywordTriggers: KeywordTrigger[];
  
  // Business Hours Auto-Reply
  businessHoursEnabled: boolean;
  businessHoursPrompt: string;
  businessHoursDelay: number;
  businessHoursStart: string;
  businessHoursEnd: string;
  businessHoursAttachments: FileAttachment[];
  
  // Order Status Updates
  orderStatusEnabled: boolean;
  orderKeywords: KeywordTrigger[];
  orderPrompt: string;
  orderDelay: number;
  orderAttachments: FileAttachment[];
  
  // Customer Support Escalation
  supportEscalationEnabled: boolean;
  supportKeywords: KeywordTrigger[];
  supportPrompt: string;
  supportDelay: number;
  supportAttachments: FileAttachment[];
  
  // Product Catalog Sharing
  catalogSharingEnabled: boolean;
  catalogKeywords: KeywordTrigger[];
  catalogPrompt: string;
  catalogDelay: number;
  catalogAttachments: FileAttachment[];
  
  // Appointment Booking
  appointmentBookingEnabled: boolean;
  appointmentKeywords: KeywordTrigger[];
  appointmentPrompt: string;
  appointmentDelay: number;
  appointmentAttachments: FileAttachment[];
  
  // Payment Reminders
  paymentRemindersEnabled: boolean;
  paymentKeywords: KeywordTrigger[];
  paymentPrompt: string;
  paymentDelay: number;
  paymentAttachments: FileAttachment[];
  
  // Delivery Updates
  deliveryUpdatesEnabled: boolean;
  deliveryKeywords: KeywordTrigger[];
  deliveryPrompt: string;
  deliveryDelay: number;
  deliveryAttachments: FileAttachment[];
  
  // Customer Feedback Collection
  feedbackCollectionEnabled: boolean;
  feedbackKeywords: KeywordTrigger[];
  feedbackPrompt: string;
  feedbackDelay: number;
  feedbackAttachments: FileAttachment[];
  
  // VIP Customer Recognition
  vipRecognitionEnabled: boolean;
  vipKeywords: KeywordTrigger[];
  vipPrompt: string;
  vipDelay: number;
  vipAttachments: FileAttachment[];
  
  // Abandoned Cart Recovery
  cartRecoveryEnabled: boolean;
  cartKeywords: KeywordTrigger[];
  cartPrompt: string;
  cartDelay: number;
  cartAttachments: FileAttachment[];
  
  // AI Detection toggles for each automation
  welcomeMessageAiEnabled: boolean;
  businessHoursAiEnabled: boolean;
  orderStatusAiEnabled: boolean;
  supportEscalationAiEnabled: boolean;
  catalogSharingAiEnabled: boolean;
  appointmentBookingAiEnabled: boolean;
  paymentRemindersAiEnabled: boolean;
  deliveryUpdatesAiEnabled: boolean;
  feedbackCollectionAiEnabled: boolean;
  vipRecognitionAiEnabled: boolean;
  cartRecoveryAiEnabled: boolean;
  
  // Allow dynamic property access
  [key: string]: any;
}

const WhatsAppReactions = ({ chatbot }: WhatsAppReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    // Default Response (Essential)
    defaultResponseEnabled: false,
    defaultResponsePrompt: "👋 Hello! Thanks for reaching out. How can I help you today?",
    defaultResponseDelay: 1,
    defaultResponseAttachments: [],
    
    // Core WhatsApp Business Features
    welcomeMessageEnabled: false,
    welcomeMessagePrompt: "👋 Welcome to our WhatsApp Business! How can we help you today?",
    welcomeMessageDelay: 1,
    welcomeMessageAttachments: [],
    
    // Smart Keyword Responses
    keywordResponsesEnabled: false,
    keywordTriggers: [],
    
    // Business Hours Auto-Reply
    businessHoursEnabled: false,
    businessHoursPrompt: "🕒 Thanks for reaching out! We're currently outside business hours (9 AM - 6 PM). We'll respond first thing tomorrow!",
    businessHoursDelay: 0,
    businessHoursStart: "09:00",
    businessHoursEnd: "18:00",
    businessHoursAttachments: [],
    
    // Order Status Updates
    orderStatusEnabled: false,
    orderKeywords: [],
    orderPrompt: "📦 Let me check your order status! Please share your order number and I'll get you an instant update.",
    orderDelay: 1,
    orderAttachments: [],
    
    // Customer Support Escalation
    supportEscalationEnabled: false,
    supportKeywords: [],
    supportPrompt: "🎧 I understand you need support! Let me connect you with our specialist team right away.",
    supportDelay: 2,
    supportAttachments: [],
    
    // Product Catalog Sharing
    catalogSharingEnabled: false,
    catalogKeywords: [],
    catalogPrompt: "🛍️ Here's our latest product catalog! Browse through our amazing collection and let me know what catches your eye.",
    catalogDelay: 1,
    catalogAttachments: [],
    
    // Appointment Booking
    appointmentBookingEnabled: false,
    appointmentKeywords: [],
    appointmentPrompt: "📅 I'd love to help you book an appointment! Here are our available time slots:",
    appointmentDelay: 2,
    appointmentAttachments: [],
    
    // Payment Reminders
    paymentRemindersEnabled: false,
    paymentKeywords: [],
    paymentPrompt: "💳 Friendly payment reminder! Here are your payment options and outstanding balance details:",
    paymentDelay: 1,
    paymentAttachments: [],
    
    // Delivery Updates
    deliveryUpdatesEnabled: false,
    deliveryKeywords: [],
    deliveryPrompt: "🚚 Your delivery is on the way! Here's your real-time tracking information:",
    deliveryDelay: 1,
    deliveryAttachments: [],
    
    // Customer Feedback Collection
    feedbackCollectionEnabled: false,
    feedbackKeywords: [],
    feedbackPrompt: "⭐ We'd love your feedback! Your opinion helps us serve you better. How was your experience?",
    feedbackDelay: 3,
    feedbackAttachments: [],
    
    // VIP Customer Recognition
    vipRecognitionEnabled: false,
    vipKeywords: [],
    vipPrompt: "👑 Welcome back, VIP! You get priority support and exclusive offers. How can we assist you today?",
    vipDelay: 0,
    vipAttachments: [],
    
    // Abandoned Cart Recovery
    cartRecoveryEnabled: false,
    cartKeywords: [],
    cartPrompt: "🛒 Don't forget your items! Complete your purchase now and get 10% off with code SAVE10:",
    cartDelay: 2,
    cartAttachments: [],
    
    // AI Detection toggles for each automation
    welcomeMessageAiEnabled: false,
    businessHoursAiEnabled: false,
    orderStatusAiEnabled: false,
    supportEscalationAiEnabled: false,
    catalogSharingAiEnabled: false,
    appointmentBookingAiEnabled: false,
    paymentRemindersAiEnabled: false,
    deliveryUpdatesAiEnabled: false,
    feedbackCollectionAiEnabled: false,
    vipRecognitionAiEnabled: false,
    cartRecoveryAiEnabled: false
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        // Default response test data
        defaultResponseEnabled: true,
        
        // Core features test data
        welcomeMessageEnabled: true,
        keywordResponsesEnabled: true,
        keywordTriggers: [
          { keyword: "help", prompt: "🆘 I'm here to help! What specific assistance do you need?", delay: 1 },
          { keyword: "pricing", prompt: "💰 Here are our current prices and special offers!", delay: 2 }
        ],
        businessHoursEnabled: true,
        
        // Advanced automations test data
        orderStatusEnabled: true,
        orderKeywords: [
          { keyword: "order", prompt: "📦 Let me track your order! Please share your order number.", delay: 1 },
          { keyword: "tracking", prompt: "🔍 I'll get your tracking details right away!", delay: 1 }
        ],
        supportEscalationEnabled: true,
        supportKeywords: [
          { keyword: "problem", prompt: "🚨 I see you have an issue. Let me escalate this to our specialist team!", delay: 2 }
        ],
        catalogSharingEnabled: true,
        appointmentBookingEnabled: true,
        paymentRemindersEnabled: true,
        deliveryUpdatesEnabled: true,
        feedbackCollectionEnabled: true,
        vipRecognitionEnabled: true,
        cartRecoveryEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    const loadingToastId = toast.loading('Connecting to WhatsApp Business...', { duration: Infinity });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      toast.dismiss(loadingToastId);
      toast.success('💚 Successfully connected to WhatsApp Business!');
    } catch (error) {
      console.error('Failed to connect to WhatsApp:', error);
      toast.dismiss(loadingToastId);
      toast.error('❌ Failed to connect to WhatsApp. Please try again.');
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
      id: 'defaultResponse',
      title: 'Default Response',
      icon: <IconMessageCircle className="w-5 h-5" />,
      description: 'Fallback response when no specific automation matches',
      enabled: settingsData.defaultResponseEnabled,
      prompt: settingsData.defaultResponsePrompt,
      delay: settingsData.defaultResponseDelay,
      color: 'blue',
      hasBasicSettings: true,
      tier: 'Essential'
    },
    {
      id: 'keywordResponses',
      title: 'Smart Keyword Responses',
      icon: <IconBulb className="w-5 h-5" />,
      description: 'Automatically respond to specific keywords in customer messages',
      enabled: settingsData.keywordResponsesEnabled,
      keywords: settingsData.keywordTriggers,
      keywordField: 'keywordTriggers',
      prompt: settingsData.defaultResponsePrompt,
      delay: settingsData.defaultResponseDelay,
      color: 'green',
      tier: 'Essential'
    },
    {
      id: 'welcomeMessage',
      title: 'Welcome Message Automation',
      icon: <IconHeart className="w-5 h-5" />,
      description: 'Automatically greet new customers when they first message you',
      enabled: settingsData.welcomeMessageEnabled,
      prompt: settingsData.welcomeMessagePrompt,
      delay: settingsData.welcomeMessageDelay,
      color: 'green',
      hasBasicSettings: true,
      tier: 'Premium'
    },
    {
      id: 'businessHours',
      title: 'Business Hours Auto-Reply',
      icon: <IconClock className="w-5 h-5" />,
      description: 'Auto-respond when customers message outside business hours',
      enabled: settingsData.businessHoursEnabled,
      prompt: settingsData.businessHoursPrompt,
      delay: settingsData.businessHoursDelay,
      color: 'blue',
      hasBusinessHours: true,
      tier: 'Premium'
    },
    {
      id: 'orderStatus',
      title: 'Order Status Updates',
      icon: <IconShoppingCart className="w-5 h-5" />,
      description: 'Instantly respond to order inquiries with tracking info',
      enabled: settingsData.orderStatusEnabled,
      keywords: settingsData.orderKeywords,
      keywordField: 'orderKeywords',
      prompt: settingsData.orderPrompt,
      delay: settingsData.orderDelay,
      color: 'orange',
      tier: 'Premium'
    },
    {
      id: 'supportEscalation',
      title: 'Customer Support Escalation',
      icon: <IconHeadphones className="w-5 h-5" />,
      description: 'Auto-escalate support issues to human agents',
      enabled: settingsData.supportEscalationEnabled,
      keywords: settingsData.supportKeywords,
      keywordField: 'supportKeywords',
      prompt: settingsData.supportPrompt,
      delay: settingsData.supportDelay,
      color: 'purple',
      tier: 'Premium'
    },
    {
      id: 'catalogSharing',
      title: 'Product Catalog Sharing',
      icon: <IconGift className="w-5 h-5" />,
      description: 'Auto-share product catalogs when customers show interest',
      enabled: settingsData.catalogSharingEnabled,
      keywords: settingsData.catalogKeywords,
      keywordField: 'catalogKeywords',
      prompt: settingsData.catalogPrompt,
      delay: settingsData.catalogDelay,
      color: 'pink',
      tier: 'Premium'
    },
    {
      id: 'appointmentBooking',
      title: 'Appointment Booking Assistant',
      icon: <IconCalendar className="w-5 h-5" />,
      description: 'Help customers book appointments automatically',
      enabled: settingsData.appointmentBookingEnabled,
      keywords: settingsData.appointmentKeywords,
      keywordField: 'appointmentKeywords',
      prompt: settingsData.appointmentPrompt,
      delay: settingsData.appointmentDelay,
      color: 'red',
      tier: 'Premium'
    },
    {
      id: 'paymentReminders',
      title: 'Payment Reminders',
      icon: <IconCreditCard className="w-5 h-5" />,
      description: 'Send friendly payment reminders and options',
      enabled: settingsData.paymentRemindersEnabled,
      keywords: settingsData.paymentKeywords,
      keywordField: 'paymentKeywords',
      prompt: settingsData.paymentPrompt,
      delay: settingsData.paymentDelay,
      color: 'yellow',
      tier: 'Premium'
    },
    {
      id: 'deliveryUpdates',
      title: 'Delivery Updates',
      icon: <IconTruck className="w-5 h-5" />,
      description: 'Provide real-time delivery tracking information',
      enabled: settingsData.deliveryUpdatesEnabled,
      keywords: settingsData.deliveryKeywords,
      keywordField: 'deliveryKeywords',
      prompt: settingsData.deliveryPrompt,
      delay: settingsData.deliveryDelay,
      color: 'indigo',
      tier: 'Premium'
    },
    {
      id: 'feedbackCollection',
      title: 'Customer Feedback Collection',
      icon: <IconStar className="w-5 h-5" />,
      description: 'Automatically collect customer feedback and reviews',
      enabled: settingsData.feedbackCollectionEnabled,
      keywords: settingsData.feedbackKeywords,
      keywordField: 'feedbackKeywords',
      prompt: settingsData.feedbackPrompt,
      delay: settingsData.feedbackDelay,
      color: 'teal',
      tier: 'Premium'
    },
    {
      id: 'vipRecognition',
      title: 'VIP Customer Recognition',
      icon: <IconCrown className="w-5 h-5" />,
      description: 'Provide special treatment for VIP customers',
      enabled: settingsData.vipRecognitionEnabled,
      keywords: settingsData.vipKeywords,
      keywordField: 'vipKeywords',
      prompt: settingsData.vipPrompt,
      delay: settingsData.vipDelay,
      color: 'rose',
      tier: 'Premium'
    },
    {
      id: 'cartRecovery',
      title: 'Abandoned Cart Recovery',
      icon: <IconTarget className="w-5 h-5" />,
      description: 'Win back customers who abandoned shopping carts',
      enabled: settingsData.cartRecoveryEnabled,
      keywords: settingsData.cartKeywords,
      keywordField: 'cartKeywords',
      prompt: settingsData.cartPrompt,
      delay: settingsData.cartDelay,
      color: 'emerald',
      tier: 'Premium'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: any } = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        switch: 'bg-green-500',
        focus: 'focus:ring-green-500 focus:border-green-500'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        switch: 'bg-blue-500',
        focus: 'focus:ring-blue-500 focus:border-blue-500'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        switch: 'bg-orange-500',
        focus: 'focus:ring-orange-500 focus:border-orange-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        switch: 'bg-purple-500',
        focus: 'focus:ring-purple-500 focus:border-purple-500'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-700',
        switch: 'bg-pink-500',
        focus: 'focus:ring-pink-500 focus:border-pink-500'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        switch: 'bg-red-500',
        focus: 'focus:ring-red-500 focus:border-red-500'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        switch: 'bg-yellow-500',
        focus: 'focus:ring-yellow-500 focus:border-yellow-500'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        switch: 'bg-indigo-500',
        focus: 'focus:ring-indigo-500 focus:border-indigo-500'
      },
      teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        switch: 'bg-teal-500',
        focus: 'focus:ring-teal-500 focus:border-teal-500'
      },
      rose: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        switch: 'bg-rose-500',
        focus: 'focus:ring-rose-500 focus:border-rose-500'
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        switch: 'bg-emerald-500',
        focus: 'focus:ring-emerald-500 focus:border-emerald-500'
      }
    };
    return colorMap[color] || colorMap.green;
  };

  const getDefaultPromptPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      welcomeMessage: "👋 Welcome! How can we help you today?",
      businessHours: "🕒 We're currently closed. We'll respond during business hours!",
      orderStatus: "📦 Let me check your order status for you!",
      supportEscalation: "🎧 Let me connect you with our support team!",
      catalogSharing: "🛍️ Here's our latest product catalog!",
      appointmentBooking: "📅 I'd love to help you book an appointment!",
      paymentReminders: "💳 Here are your payment options!",
      deliveryUpdates: "🚚 Here's your delivery tracking information!",
      feedbackCollection: "⭐ We'd love your feedback!",
      vipRecognition: "👑 Welcome back, VIP customer!",
      cartRecovery: "🛒 Don't forget your items! Complete your purchase!"
    };
    return placeholders[sectionId] || "Enter your custom response message...";
  };

  const getKeywordExamples = (sectionId: string) => {
    const examples: { [key: string]: string } = {
      orderStatus: "order, tracking, status, shipment, delivery",
      supportEscalation: "problem, issue, complaint, help, support",
      catalogSharing: "products, catalog, browse, shop, items",
      appointmentBooking: "appointment, booking, schedule, meeting, consultation",
      paymentReminders: "payment, pay, invoice, bill, due",
      deliveryUpdates: "delivery, shipping, track, location, when",
      feedbackCollection: "feedback, review, rating, experience, satisfied",
      vipRecognition: "vip, premium, priority, exclusive, special",
      cartRecovery: "cart, checkout, purchase, buy, complete"
    };
    return examples[sectionId] || "keyword1, keyword2, keyword3";
  };

  const getKeywordPlaceholder = (sectionId: string) => {
    const placeholders: { [key: string]: string } = {
      orderStatus: "order",
      supportEscalation: "problem",
      catalogSharing: "products",
      appointmentBooking: "appointment",
      paymentReminders: "payment",
      deliveryUpdates: "delivery",
      feedbackCollection: "feedback",
      vipRecognition: "vip",
      cartRecovery: "cart"
    };
    return placeholders[sectionId] || "keyword";
  };

  const handleFileUpload = async (files: FileList, field: string) => {
    const maxFileSize = 16 * 1024 * 1024; // 16MB limit for WhatsApp
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
    
    const validFiles: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxFileSize) {
        toast.error(`❌ File "${file.name}" is too large. Max size is 16MB.`);
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
    const maxFileSize = 16 * 1024 * 1024;
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
    
    const validFiles: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxFileSize) {
        toast.error(`❌ File "${file.name}" is too large. Max size is 16MB.`);
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">WhatsApp Business Not Connected</p>
                <p className="text-xs text-orange-600">Connect your WhatsApp Business account to enable these powerful automation features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
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
                {isConnecting ? "Connecting..." : "Connect WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandWhatsapp className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">WhatsApp Business Automation</h1>
              <p className="mt-1 text-white/80">11 intelligent automations to transform customer conversations into business growth</p>
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
        {/* Advanced Automations */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Essential WhatsApp Business Automations</h2>
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
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                      <h4 className="font-medium text-gray-700">Default Response Settings</h4>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-2">
                        <strong>When used:</strong> When no specific keyword triggers match, this default response will be sent
                      </p>
                      <p className="text-xs text-blue-600">
                        💡 <strong>How it works:</strong> Customer messages are analyzed for intent, and this automation responds when relevant
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
                        
                        {/* Business Hours Settings */}
                        {section.hasBusinessHours && (
                          <div className="mt-4 space-y-3">
                            <h5 className="text-sm font-medium text-gray-700">Business Hours</h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                                <input
                                  type="time"
                                  className={`w-full border border-gray-300 rounded p-2 text-sm ${colors.focus}`}
                                  value={settingsData.businessHoursStart}
                                  onChange={(e) => setSettingsData({ ...settingsData, businessHoursStart: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">End Time</label>
                                <input
                                  type="time"
                                  className={`w-full border border-gray-300 rounded p-2 text-sm ${colors.focus}`}
                                  value={settingsData.businessHoursEnd}
                                  onChange={(e) => setSettingsData({ ...settingsData, businessHoursEnd: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
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
                        <p className="text-xs text-gray-500">Supports: Images, Videos, Audio, PDFs • Max 16MB per file</p>
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
                          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">{section.hasBusinessHours ? '3' : '2'}</span>
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
                          <strong>When used:</strong> When customer's message contains these exact keywords/phrases (takes priority over default response)
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

        {/* Premium Automations */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Premium WhatsApp Business Automations</h2>
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
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                      <h4 className="font-medium text-gray-700">Default Response Settings</h4>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-700 mb-2">
                        <strong>When used:</strong> When no specific keyword triggers match, this default response will be sent
                      </p>
                      <p className="text-xs text-purple-600">
                        💡 <strong>How it works:</strong> Customer messages are analyzed for intent, and this automation responds when relevant
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
                        
                        {/* Business Hours Settings */}
                        {section.hasBusinessHours && (
                          <div className="mt-4 space-y-3">
                            <h5 className="text-sm font-medium text-gray-700">Business Hours</h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                                <input
                                  type="time"
                                  className={`w-full border border-gray-300 rounded p-2 text-sm ${colors.focus}`}
                                  value={settingsData.businessHoursStart}
                                  onChange={(e) => setSettingsData({ ...settingsData, businessHoursStart: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">End Time</label>
                                <input
                                  type="time"
                                  className={`w-full border border-gray-300 rounded p-2 text-sm ${colors.focus}`}
                                  value={settingsData.businessHoursEnd}
                                  onChange={(e) => setSettingsData({ ...settingsData, businessHoursEnd: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
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
                        <p className="text-xs text-gray-500">Supports: Images, Videos, Audio, PDFs • Max 16MB per file</p>
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
                          <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">{section.hasBusinessHours ? '3' : '2'}</span>
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
                          <strong>When used:</strong> When customer's message contains these exact keywords/phrases (takes priority over default response)
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
        <div className="flex justify-end pt-4 border-t border-green-200">
          <button 
            disabled={!canInteract}
            onClick={() => {
              toast.success('💾 WhatsApp automation settings saved successfully!');
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Automation Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppReactions;
