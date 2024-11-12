import { XCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-400 mr-3" />
          <span className="text-red-700">{message}</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}