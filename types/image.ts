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
    config: any;
    transformationUrl: string | null;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    createdAt: Date;
    updatedAt: Date;
    author?: IAuthor | null;
  }
  