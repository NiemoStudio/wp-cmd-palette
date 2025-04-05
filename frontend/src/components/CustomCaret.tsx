import { motion } from "motion/react"
import { useEffect, useState } from 'react';

interface CustomCaretProps {
  color: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function CustomCaret({ color, inputRef }: CustomCaretProps) {
  const [caretPosition, setCaretPosition] = useState({ height: 20, x: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!inputRef.current) return;

    const updateCaretPosition = () => {
      const input = inputRef.current;
      if (!input) return;

      const { selectionEnd, selectionStart } = input;
      if (selectionStart !== selectionEnd) return; // Don't show caret during selection

      // Create a temporary span to measure text width
      const span = document.createElement('span');
      span.style.font = window.getComputedStyle(input).font;
      span.textContent = input.value.substring(0, selectionStart ?? 0);

      // Measure the text width
      document.body.appendChild(span);
      const position = span.offsetWidth;
      document.body.removeChild(span);

      // Get input's font size for caret height
      const computedStyle = window.getComputedStyle(input);
      const fontSize = parseInt(computedStyle.fontSize);

      // Get input's width and padding
      const inputWidth = input.offsetWidth;
      const inputStyle = window.getComputedStyle(input);
      const paddingLeft = parseInt(inputStyle.paddingLeft);
      const paddingRight = parseInt(inputStyle.paddingRight);
      const availableWidth = inputWidth - paddingLeft - paddingRight;

      // Constrain the caret position to the input's width
      const constrainedPosition = Math.min(position, availableWidth);

      setCaretPosition({
        height: fontSize * 1.2, // Slightly taller than font
        x: constrainedPosition + paddingLeft, // Add paddingLeft to position the caret correctly
      });
      setIsReady(true);
    };

    const input = inputRef.current;

    // Calculate initial position immediately
    updateCaretPosition();

    // Then set up event listeners for subsequent updates
    input.addEventListener('input', updateCaretPosition);
    input.addEventListener('click', updateCaretPosition);
    input.addEventListener('keyup', updateCaretPosition);

    return () => {
      input.removeEventListener('input', updateCaretPosition);
      input.removeEventListener('click', updateCaretPosition);
      input.removeEventListener('keyup', updateCaretPosition);
    };
  }, [inputRef]);

  return (
    <motion.div
      animate={{
        opacity: isReady ? [1, 0, 1] : 0,
      }}
      data-cmdk-caret-color={color}
      style={{
        height: caretPosition.height,
        left: caretPosition.x,
        top: '50%',
        translateY: '-50%',
      }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
        times: [0, 0.3, 1],
      }}
      data-cmdk-caret
    />
  );
}
