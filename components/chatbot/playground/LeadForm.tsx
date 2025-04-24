import React from 'react';
import { ChatbotLeadSettings } from './types';
import { toast } from 'react-hot-toast';

interface LeadFormProps {
  leadSetting: ChatbotLeadSettings;
  onClose: () => void;
  chatbotId: string;
  conversationId?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ leadSetting, onClose, chatbotId, conversationId }) => {
  const handleLeadFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');

    const customQuestions = leadSetting?.customQuestions || [];
    const customAnswers = customQuestions.reduce((answers, question) => {
      answers[question] = formData.get(question) as string;
      return answers;
    }, {} as Record<string, string>);

    try {
      const response = await fetch('/api/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          name,
          email,
          phone,
          customAnswers,
          conversationId
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          // Handle invalid email error
          const data = await response.json();
          onClose();
          toast.error(data.error);
          return;
        } else {
          throw new Error('Failed to submit lead');
        }
      }

      toast.success('Thank you for your attention.');
      onClose();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('Something went wrong.');
      onClose();
    }
  };

  return (
    <div className="py-3">
      <div className="hyphens-auto break-words rounded-[20px] text-left text-sm leading-5 antialiased relative inline-block max-w-full rounded-r-[20px] rounded-l px-5 py-4 only:rounded-[20px] last:rounded-tl first:rounded-tl-[20px] first:rounded-bl only:rounded-bl last:rounded-bl-[20px] bg-zinc-200/50 text-zinc-800 group-data-[theme=dark]:bg-zinc-800/80 group-data-[theme=dark]:text-zinc-300">
        <div className="float-left clear-both">
          <div className="flex space-x-3">
            <div className="flex-1 gap-4">
              <div className="text-left text-inherit">
                <form onSubmit={handleLeadFormSubmit}>
                  <div className="mb-4 flex items-start justify-between">
                    <h4 className="pr-8 font-semibold text-sm">{leadSetting?.title}</h4>
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 underline-offset-4 hover:underline dark:text-zinc-50 h-9 w-9 absolute top-0 right-0 p-0 group-data-[theme=dark]:hover:text-zinc-400 group-data-[theme=dark]:text-zinc-300 text-zinc-700 hover:text-zinc-600"
                      type="button"
                      onClick={onClose}
                      aria-label="Close contact form"
                      title="Close contact form">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  {
                    leadSetting?.name
                    && <div className="mb-4">
                      <label className="mb-1 block font-medium text-sm" htmlFor="name">Name</label>
                      <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                        <input id="name" autoComplete="name" className="w-full min-w-0 flex-auto appearance-none rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" maxLength={70} aria-label="Name" title="Name" name="name" />
                      </div>
                    </div>
                  }
                  {
                    leadSetting?.email
                    && <div className="mb-4">
                      <label className="mb-1 block font-medium text-sm" htmlFor="email">Email</label>
                      <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                        <input id="email" autoComplete="email" required={true} className="w-full min-w-0 flex-auto rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" aria-label="Email" title="Email" type="email" name="email" />
                      </div>
                    </div>
                  }
                  {
                    leadSetting?.phone
                    && <div className="mb-4">
                      <label className="mb-1 block font-medium text-sm" htmlFor="phone">Phone Number</label>
                      <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                        <input id="phone" autoComplete="tel" required={true} className="w-full min-w-0 flex-auto appearance-none rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" aria-label="Phone Number" title="Phone Number" type="tel" name="phone" />
                      </div>
                    </div>
                  }
                  {
                    leadSetting?.customQuestions?.map((question, index) => (
                      <div key={index} className="mb-4">
                        <label className="mb-1 block font-medium text-sm" htmlFor={`customQuestion-${index}`}>{question}</label>
                        <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                          <input id={`${question}`} className="w-full min-w-0 flex-auto rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" aria-label={question} title={question} name={question} />
                        </div>
                      </div>
                    ))
                  }
                  <div className="flex items-end justify-between">
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1"
                      aria-label="Send your contact info"
                      title="Send your contact info"
                      type="submit">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z">
                        </path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
