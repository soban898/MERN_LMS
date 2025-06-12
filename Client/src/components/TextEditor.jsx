import React, { useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TextEditor = ({ input, setInput }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  // Function to handle text changes
  const handleTextChange = useCallback(() => {
    if (quillInstance.current) {
      const newContent = quillInstance.current.root.innerHTML;
      
      // ✅ Only update state if content has changed to prevent unnecessary re-renders
      if (newContent !== input.description) {
        setInput((prevInput) => ({
          ...prevInput,
          description: newContent,
        }));
      }
    }
  }, [input.description, setInput]);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      quillInstance.current.on("text-change", handleTextChange);
    }
  }, [handleTextChange]);

  // ✅ Ensure Quill updates only when necessary, avoiding cursor reset
  useEffect(() => {
    if (quillInstance.current) {
      const currentContent = quillInstance.current.root.innerHTML;
      if (currentContent !== input.description) {
        quillInstance.current.root.innerHTML = input.description || "";
      }
    }
  }, [input.description]);

  return <div ref={editorRef} />;
};

export default TextEditor;
