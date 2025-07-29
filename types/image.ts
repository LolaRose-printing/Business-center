export interface IAuthor {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  }
  
  export interface IImage {
    id: string;
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width: number | null;
    height: number | null;
    config: any; // You can replace 'any' with Transformations if you have that type
    transformationUrl: string | null; // fixed casing for URL
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    createdAt: Date;
    updatedAt: Date;
    author?: IAuthor | null;
  }
  