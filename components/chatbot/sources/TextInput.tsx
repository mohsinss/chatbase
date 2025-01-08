import { useState } from 'react';

interface TextInputProps {
  text: string,
  setText: (value: string | ((prevState: string) => string)) => void;
}

const TextInput = ({ setText, text }: TextInputProps) => {

  const handleTextChange = (value: string) => {
    setText(value);
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold">Text</h2>
      
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Enter your text here..."
        className="w-full min-h-[400px] p-4 text-base rounded-lg border border-gray-200 
          focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
      />

      <div className="text-right text-sm text-gray-500">
        {text.length} characters
      </div>
    </div>
  );
};

export default TextInput; 