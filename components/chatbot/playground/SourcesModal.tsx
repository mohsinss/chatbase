import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { Icon } from 'lucide-react';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: any[];
  loadingSources: boolean;
}

const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose, sources, loadingSources }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="z-[11] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 pt-8 rounded shadow-lg relative min-w-[400px] max-w-[800px] w-[80%] h-[80%] overflow-x-hidden overflow-y-scroll">
        <button onClick={onClose} className="absolute top-2 right-2">
          ✖️
        </button>
        <h1 className="font-bold text-2xl">Sources</h1>
        {loadingSources && (
          <div className="flex items-center justify-center h-[100px]">
            <IconLoader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        )}
        {!loadingSources && sources.map((chunk, index) => (
          <div key={'chunk-' + chunk.chunk.id} className="border-b-[1px] pt-2">
            {chunk.chunk.chunk_html}
          </div>
        ))}
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-md border-[1px] bg-white p-2 text-center hover:bg-slate-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SourcesModal;
