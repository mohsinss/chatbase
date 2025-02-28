import React from 'react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface QAPair {
  id: string;
  question: string;
  answer: string;
  subQuestions?: QAPair[]; // Allow nested questions
}

interface QAInputProps {
  qaPairs: QAPair[];
  setQaPairs: React.Dispatch<React.SetStateAction<QAPair[]>>;
}

const QAInput: React.FC<QAInputProps> = ({ qaPairs, setQaPairs }) => {
  const [currentQAPairs, setCurrentQAPairs] = useState<QAPair[]>(qaPairs);

  const addQAPair = (parentId?: string) => {
    const newPair: QAPair = {
      id: Date.now().toString(),
      question: '',
      answer: '',
      subQuestions: [],
    };

    if (parentId) {
      const updatedPairs = currentQAPairs.map(pair => 
        pair.id === parentId 
          ? { ...pair, subQuestions: [...(pair.subQuestions || []), newPair] }
          : pair
      );
      setCurrentQAPairs(updatedPairs);
    } else {
      setCurrentQAPairs([...currentQAPairs, newPair]);
    }
  };

  const updateQAPair = (id: string, field: 'question' | 'answer', value: string) => {
    const updatePairs = (pairs: QAPair[]): QAPair[] => 
      pairs.map(pair => 
        pair.id === id 
          ? { ...pair, [field]: value }
          : { ...pair, subQuestions: updatePairs(pair.subQuestions || []) }
      );

    setCurrentQAPairs(updatePairs(currentQAPairs));
  };

  const renderQAPairs = (pairs: QAPair[]) => (
    <div className="space-y-6">
      {pairs.map(pair => (
        <div key={pair.id} className="p-6 bg-white rounded-lg border relative">
          <button
            onClick={() => addQAPair(pair.id)}
            className="absolute right-4 top-4 text-gray-400 hover:text-blue-500"
          >
            Add Sub-Question
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <Textarea
                value={pair.question}
                onChange={(e) => updateQAPair(pair.id, 'question', e.target.value)}
                placeholder="Enter your question..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Answer</label>
              <Textarea
                value={pair.answer}
                onChange={(e) => updateQAPair(pair.id, 'answer', e.target.value)}
                placeholder="Enter your answer..."
                className="min-h-[200px]"
              />
            </div>

            {pair.subQuestions && renderQAPairs(pair.subQuestions)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Q&A</h2>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => addQAPair()}
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200"
          >
            <IconPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {renderQAPairs(currentQAPairs)}
    </div>
  );
};

export default QAInput; 