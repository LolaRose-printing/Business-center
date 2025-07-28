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

// ✅ FINAL: This MUST match exactly.
type Transformations =
  | { restore: boolean }
  | { removeBackground: boolean }
  | { someOtherOption?: string };  // Include your optional shape!

interface Image {
  id: string;
  transformationType: string;
  config: Transformations | null;
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

  const transformation = transformationTypes[
    image.transformationType as keyof typeof transformationTypes
  ];

  const config: Transformations | null = image.config ?? null;

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user.id}
          type={image.transformationType as keyof typeof transformationTypes}
          creditBalance={user.creditBalance}
          config={config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
