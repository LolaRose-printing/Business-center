export type Transformations =
  | { restore: boolean }
  | { removeBackground: boolean }
  | { fillBackground: boolean }
  | { remove: { prompt: string; removeShadow: boolean; multiple: boolean } }  // ✅ Add this!
  | { recolor: { prompt: string; to: string; multiple: boolean } }  // ✅ And maybe this too!
  | { someOtherOption?: string };
