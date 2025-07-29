export type Transformations =
  | { restore: boolean }
  | { removeBackground: boolean }
  | { fillBackground: boolean } // ✅ Add this line!
  | { someOtherOption?: string };
