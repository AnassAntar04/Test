export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 p-3 animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dots" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dots" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dots" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span className="text-xs text-muted-foreground">IA Assistant en train d'écrire...</span>
    </div>
  );
};