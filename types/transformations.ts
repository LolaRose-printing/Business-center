export interface Transformations {
    restore?: boolean;
    removeBackground?: boolean;
    fillBackground?: boolean;
    remove?: { prompt: string; removeShadow: boolean; multiple: boolean };
    recolor?: { prompt: string; to: string; multiple: boolean };
    someOtherOption?: string;
  }
  