import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { getImageById } from "@/lib/actions/image.actions";

type SearchParamProps = {
  params: {
    id: string;
  };
};

// --- Example: Define Transformations type ---
// Replace or adjust based on your actual Transformations shape
type Transformations =
  | { restore: boolean }
  | { removeBackground: boolean }
  | { someOtherOption?: string } // add more variants as needed
  | null;

// --- Example: Define Image type ---
// Adjust fields as per your real Image data structure
interface Image {
  id: string;
  transformationType: string; // should match keys in transformationTypes
  config: Transformations | null;
  // ... other image fields
}

async function getCurrentUserId() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.userId;
}

const Page = async ({ params: { id } }: SearchParamProps) => {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const image = (await getImageById(id)) as Image | null;

  if (!image) redirect("/404");

  // Get transformation metadata from constant
  const transformation = transformationTypes[
    image.transformationType as keyof typeof transformationTypes
  ];

  // Cast the user config from image.config properly
  const config = image.config ?? null; // type: Transformations | null

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user.id} // or user._id depending on your user model
          type={image.transformationType as keyof typeof transformationTypes}
          creditBalance={user.creditBalance}
          config={config}   // pass user config here correctly
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
