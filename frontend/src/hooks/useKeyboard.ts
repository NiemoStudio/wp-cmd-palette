import { useEffect } from "react";

interface UseKeyboardProps {
  shortcutKey?: string;
  onClose?: () => void;
  onOpen?: () => void;
}

export function useKeyboard({
  shortcutKey = "k",
  onClose,
  onOpen,
}: UseKeyboardProps = {}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Handle CMD+K or CTRL+K
      if (
        event.key.toLowerCase() === shortcutKey &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        onOpen?.();
      }

      // Handle ESC key
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpen, onClose, shortcutKey]);
}
