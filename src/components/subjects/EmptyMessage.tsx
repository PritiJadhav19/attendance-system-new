
import React from 'react';

interface EmptyMessageProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  isPageLevel?: boolean;
}

export const EmptyMessage: React.FC<EmptyMessageProps> = ({ icon: Icon, title, description, isPageLevel = false }) => {
  if (isPageLevel) {
    return (
      <div className="text-center">
        <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">{title}</p>
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      </div>
    );
  }

  return (
    <div className="text-center py-8 bg-muted/40 rounded-lg">
      <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-muted-foreground">{title}</p>
    </div>
  );
};
