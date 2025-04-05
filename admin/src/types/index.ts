import { IconName } from "@/lib/icons";

export interface Page {
  color?: ColorKey;
  hidden?: boolean;
  icon?: IconName;
  id: number;
  order?: number;
  title: string;
  type: string;
  url: string;
}

export interface PageAction {
  disabled?: boolean;
  label: string;
  variant?: "outline" | "default";
  handleClick: () => void;
}

export type ColorKey =
  | "blue"
  | "gray"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "yellow"
  | "pink";

export const PRESET_COLORS: Record<ColorKey, string> = {
  blue: "bg-blue-500",
  gray: "bg-gray-300",
  green: "bg-green-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
};

export type StylingSettings = {
  colors: {
    activeItem:
      | "gray"
      | "blue"
      | "green"
      | "yellow"
      | "red"
      | "purple"
      | "orange"
      | "pink";
    cursor:
      | "gray"
      | "blue"
      | "green"
      | "yellow"
      | "red"
      | "purple"
      | "orange"
      | "pink";
  };
  container: {
    opacity: "Low" | "Medium" | "None";
    radius: "Small" | "Medium" | "Large" | "Extra Large";
  };
  icon: {
    radius: "Small" | "Medium" | "Circle";
  };
  overlay: {
    opacity: "Low" | "Medium" | "High" | "None";
  };
};

declare global {
  interface Window {
    wpApiSettings: {
      nonce: string;
      root: string;
    };
  }
}
