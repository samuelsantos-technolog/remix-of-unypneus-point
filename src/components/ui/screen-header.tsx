import { ArrowLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightContent?: React.ReactNode;
}

export const ScreenHeader = ({ title, subtitle, onBack, rightContent }: ScreenHeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-primary-foreground/70">{subtitle}</p>
            )}
          </div>
        </div>
        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>
    </header>
  );
};
