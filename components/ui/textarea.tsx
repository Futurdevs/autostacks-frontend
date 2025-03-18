import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoExpand?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoExpand = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    // Combine the forwarded ref with our local ref
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-resize function
    const resizeTextarea = React.useCallback(() => {
      if (!textareaRef.current || !autoExpand) return;
      
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      
      // Set the height to the scrollHeight to expand the textarea
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [autoExpand]);

    // Add event listeners for auto-resize
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoExpand) return;
      
      // Initial resize
      resizeTextarea();
      
      // Resize on input
      const handleInput = () => resizeTextarea();
      textarea.addEventListener("input", handleInput);
      
      // Cleanup
      return () => {
        textarea.removeEventListener("input", handleInput);
      };
    }, [autoExpand, resizeTextarea]);

    return (
      <textarea
        className={cn(
          "flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={textareaRef}
        rows={1}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea }; 