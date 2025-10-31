import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = '',
}) => {
  return (
    <div
      className={`bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
      <p className="text-sm text-error flex-1">{message}</p>
    </div>
  );
};
