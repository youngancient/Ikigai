import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

interface CopyButtonProps {
    text: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }

  export const CopyButton = ({ text, className = '', onClick }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);
  
    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };
  
    return (
      <button
        onClick={handleCopy}
        className={`inline-flex items-center p-1 hover:bg-gray-700 rounded ${className}`}
        title="Copy to clipboard"
      >
        {copied ? (
          <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        )}
      </button>
    );
  };