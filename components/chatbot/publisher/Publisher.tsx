"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  IconBrandWhatsapp, 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandSnapchat,
  IconChevronDown,
  IconChevronUp,
  IconSend,
  IconCalendar,
  IconDeviceFloppy,
  IconList,
  IconLayoutGrid,
  IconCalendarEvent,
  IconTemplate,
  IconPaperclip
} from "@tabler/icons-react";
import { useState } from "react";

const PUBLISHER_TABS = [
  { id: "whatsapp", label: "WhatsApp", icon: <IconBrandWhatsapp className="w-5 h-5" /> },
  { id: "facebook", label: "Facebook", icon: <IconBrandFacebook className="w-5 h-5" /> },
  { id: "twitter", label: "Twitter", icon: <IconBrandTwitter className="w-5 h-5" /> },
  { id: "instagram", label: "Instagram", icon: <IconBrandInstagram className="w-5 h-5" /> },
  { id: "snapchat", label: "Snapchat", icon: <IconBrandSnapchat className="w-5 h-5" /> },
];

const VIEW_OPTIONS = [
  { id: "list", label: "List", icon: <IconList className="w-5 h-5" /> },
  { id: "calendar", label: "Calendar", icon: <IconCalendarEvent className="w-5 h-5" /> },
  { id: "grid", label: "Grid", icon: <IconLayoutGrid className="w-5 h-5" /> },
];

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'scheduled' | 'draft' | 'published';
  date: string;
}

// Mock data for posts
const MOCK_POSTS: Post[] = [
  { id: '1', title: 'Welcome message', content: 'Welcome to our service!', status: 'published', date: '2023-10-15' },
  { id: '2', title: 'Holiday promotion', content: 'Special holiday offers!', status: 'scheduled', date: '2023-12-01' },
  { id: '3', title: 'Product update', content: 'New features coming soon', status: 'draft', date: '2023-11-20' },
  { id: '4', title: 'Customer survey', content: 'Help us improve our service', status: 'scheduled', date: '2023-11-10' },
  { id: '5', title: 'Black Friday sale', content: 'Biggest discounts of the year!', status: 'draft', date: '2023-11-24' },
];

const PostSection = ({ title, posts }: { title: string; posts: Post[] }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium">{title} ({posts.length})</h3>
        {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
      </div>
      
      {expanded && (
        <div className="divide-y">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <h4 className="font-medium">{post.title}</h4>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{post.content}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No posts available</div>
          )}
        </div>
      )}
    </div>
  );
};

interface PublisherProps {
  teamId: string;
  chatbotId: string;
  domain?: string;
  chatbot?: any;
}

const Publisher = ({
  teamId,
  chatbotId,
  domain,
  chatbot
}: PublisherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'whatsapp';
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/publisher/${tabId}`);
  };

  const handlePublish = () => {
    console.log('Publishing post:', { title: postTitle, content: postContent });
    // Add API call to publish post
    alert('Post published successfully!');
    setPostTitle('');
    setPostContent('');
  };

  const handleSchedule = () => {
    if (!scheduleDate) {
      setShowScheduler(true);
      return;
    }
    
    console.log('Scheduling post:', { title: postTitle, content: postContent, date: scheduleDate });
    // Add API call to schedule post
    alert(`Post scheduled for ${scheduleDate}`);
    setPostTitle('');
    setPostContent('');
    setScheduleDate('');
    setShowScheduler(false);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', { title: postTitle, content: postContent });
    // Add API call to save draft
    alert('Draft saved successfully!');
    setPostTitle('');
    setPostContent('');
  };

  const handleImportTemplate = () => {
    // This would open a modal or dropdown with templates
    alert('Template import functionality would open here');
  };

  const handleAttach = () => {
    // This would open a file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // In a real app, you would upload these files to your server
        // and get back URLs. Here we'll just use the file names.
        const newAttachments = Array.from(files).map(file => file.name);
        setAttachments([...attachments, ...newAttachments]);
      }
    };
    
    input.click();
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Filter posts by status
  const scheduledPosts = MOCK_POSTS.filter(post => post.status === 'scheduled');
  const draftPosts = MOCK_POSTS.filter(post => post.status === 'draft');
  const publishedPosts = MOCK_POSTS.filter(post => post.status === 'published');

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Publisher</h1>

        {/* Responsive Nav */}
        <div className="md:flex md:space-x-8">
          {/* Nav Menu - Side on desktop, Top on mobile */}
          <div className="mb-6 md:mb-0 md:w-48">
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
              {PUBLISHER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full
                    ${currentTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="flex flex-row items-center gap-2 pb-3 mb-4 border-b">
              <Link
                href={`/dashboard/${teamId}/chatbot/${chatbotId}/publisher`}
                className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                Publisher
              </Link>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <div className="text-gray-900 font-bold">
                {PUBLISHER_TABS.find(tab => tab.id === currentTab)?.label || 'Social Media'}
              </div>
            </div>
            
            {/* Post Composer */}
            <div className="mb-6 border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Post</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleImportTemplate}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <IconTemplate size={16} />
                    Import Template
                  </button>
                  <button
                    onClick={handleAttach}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <IconPaperclip size={16} />
                    Attach
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Post Title
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-1">
                    Post Content
                  </label>
                  <textarea
                    id="post-content"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What would you like to share?"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                {/* Attachments display */}
                {attachments.length > 0 && (
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                          <IconPaperclip size={14} className="text-gray-500" />
                          <span className="truncate max-w-[150px]">{attachment}</span>
                          <button 
                            onClick={() => removeAttachment(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {showScheduler && (
                  <div>
                    <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Date
                    </label>
                    <input
                      id="schedule-date"
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <IconDeviceFloppy size={18} />
                    Save Draft
                  </button>
                  
                  <button
                    onClick={handleSchedule}
                    className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5"
                  >
                    <IconCalendar size={18} />
                    {showScheduler ? 'Confirm Schedule' : 'Schedule'}
                  </button>
                  
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    <IconSend size={18} />
                    Publish Now
                  </button>
                </div>
              </div>
            </div>
            
            {/* View Options - Moved above the post lists */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Posts</h2>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {VIEW_OPTIONS.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setCurrentView(view.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors
                      ${currentView === view.id
                        ? "bg-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"}`}
                  >
                    {view.icon}
                    <span className="text-sm font-medium">{view.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Post Lists - conditionally render based on view */}
            {currentView === 'list' && (
              <div className="space-y-4">
                <PostSection title="Scheduled Posts" posts={scheduledPosts} />
                <PostSection title="Drafts" posts={draftPosts} />
                <PostSection title="Published Posts" posts={publishedPosts} />
              </div>
            )}
            
            {currentView === 'calendar' && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <p className="text-gray-500">Calendar view coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">This view will show posts organized by date</p>
                </div>
              </div>
            )}
            
            {currentView === 'grid' && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Grid View</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...scheduledPosts, ...draftPosts, ...publishedPosts].map(post => (
                    <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{post.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' : 
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                      <div className="text-xs text-gray-500">{post.date}</div>
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
};

export default Publisher; 