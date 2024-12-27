import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

interface QAInputProps {
  onQAChange: (qaPairs: QAPair[]) => void;
}

const QAInput = ({ onQAChange }: QAInputProps) => {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([
    { id: '1', question: '', answer: '' }
  ]);

  const addQAPair = () => {
    const newPair = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    setQaPairs([...qaPairs, newPair]);
    onQAChange([...qaPairs, newPair]);
  };

  const deleteQAPair = (id: string) => {
    const newPairs = qaPairs.filter(pair => pair.id !== id);
    setQaPairs(newPairs);
    onQAChange(newPairs);
  };

  const deleteAll = () => {
    setQaPairs([{ id: Date.now().toString(), question: '', answer: '' }]);
    onQAChange([]);
  };

  const updateQAPair = (id: string, field: 'question' | 'answer', value: string) => {
    const newPairs = qaPairs.map(pair => 
      pair.id === id ? { ...pair, [field]: value } : pair
    );
    setQaPairs(newPairs);
    onQAChange(newPairs);
  };

  return (
    <div className="w-full min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Q&A</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={deleteAll}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Delete all
          </button>
          <Button
            onClick={addQAPair}
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200"
          >
            <IconPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {qaPairs.map((pair) => (
          <div 
            key={pair.id} 
            className="p-6 bg-white rounded-lg border relative"
          >
            <button
              onClick={() => deleteQAPair(pair.id)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
            >
              <IconTrash className="h-5 w-5" />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAInput; 