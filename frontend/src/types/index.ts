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

export interface SearchResult {
  color?: string;
  current?: boolean;
  hidden?: boolean;
  icon?: string;
  id: number;
  order?: number;
  pinned?: boolean;
  title: string;
  type: string;
  url: string;
}

declare global {
  interface Window {
    wpCmdPalette: {
      settings: StylingSettings;
      siteName: string;
    };
  }
}
