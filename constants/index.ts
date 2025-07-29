// Navigation link type for internal routes or external URLs
interface NavLink {
  label: string;
  route?: string; // Internal route
  url?: string;   // External URL
  icon: string;
}

// Nav links used in sidebar/menu
export const navLinks: NavLink[] = [
  {
    label: "Home",
    route: "/",
    icon: "/assets/icons/home.svg",
  },
  {
    label: "Image Restore",
    route: "/transformations/add/restore",
    icon: "/assets/icons/image.svg",
  },
  {
    label: "Generative Fill",
    route: "/transformations/add/fill",
    icon: "/assets/icons/stars.svg",
  },
  {
    label: "Object Remove",
    route: "/transformations/add/remove",
    icon: "/assets/icons/scan.svg",
  },
  {
    label: "Object Recolor",
    route: "/transformations/add/recolor",
    icon: "/assets/icons/filter.svg",
  },
  {
    label: "Background Remove",
    route: "/transformations/add/removeBackground",
    icon: "/assets/icons/camera.svg",
  },
  {
    label: "Shop",
    url: "https://rosehub.lolaprint.us/shop",
    icon: "/assets/icons/bag.svg",
  },
  {
    label: "Profile",
    route: "/profile",
    icon: "/assets/icons/profile.svg",
  },
  {
    label: "Buy Credits",
    route: "/credits",
    icon: "/assets/icons/bag.svg",
  },
];

// External navigation links (completely external URLs)
export const externalNavLinks: NavLink[] = [
  {
    label: "Online printing",
    url: "https://lolaprint.us/service",
    icon: "/assets/images/1.png",
  },
  {
    label: "Design Media",
    url: "https://design.lolaprint.us",
    icon: "/assets/images/2.png",
  },
  {
    label: "Rosehub",
    url: "https://rosehub.lolaprint.us",
    icon: "/assets/images/3.png",
  },
  {
    label: "Lola365",
    url: "https://lola365.lolaprint.us",
    icon: "/assets/images/4.png",
  },
];

// Plan type and data
interface PlanInclusion {
  label: string;
  isIncluded: boolean;
}

interface Plan {
  _id: number;
  name: string;
  icon: string;
  price: number;
  credits: number;
  inclusions: PlanInclusion[];
}

export const plans: Plan[] = [
  {
    _id: 1,
    name: "Free",
    icon: "/assets/icons/free-plan.svg",
    price: 0,
    credits: 20,
    inclusions: [
      { label: "20 Free Credits", isIncluded: true },
      { label: "Basic Access to Services", isIncluded: true },
      { label: "Priority Customer Support", isIncluded: false },
      { label: "Priority Updates", isIncluded: false },
    ],
  },
  {
    _id: 2,
    name: "Pro Package",
    icon: "/assets/icons/free-plan.svg",
    price: 40,
    credits: 120,
    inclusions: [
      { label: "120 Credits", isIncluded: true },
      { label: "Full Access to Services", isIncluded: true },
      { label: "Priority Customer Support", isIncluded: true },
      { label: "Priority Updates", isIncluded: false },
    ],
  },
  {
    _id: 3,
    name: "Premium Package",
    icon: "/assets/icons/free-plan.svg",
    price: 199,
    credits: 2000,
    inclusions: [
      { label: "2000 Credits", isIncluded: true },
      { label: "Full Access to Services", isIncluded: true },
      { label: "Priority Customer Support", isIncluded: true },
      { label: "Priority Updates", isIncluded: true },
    ],
  },
];

// Type helper for transformation keys (import or define transformationTypes somewhere)
type TransformationTypeKey = keyof typeof transformationTypes;

// Form props interface
export interface TransformationFormProps {
  action: string;
  data?: any | null;
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  config: Transformations | null;
}

// Aspect ratio options with explicit type
export const aspectRatioOptions = {
  "1:1": {
    aspectRatio: "1:1",
    label: "Square (1:1)",
    width: 1000,
    height: 1000,
  },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
};

// Default form values
export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

// Credit fee constant
export const creditFee = -1;
