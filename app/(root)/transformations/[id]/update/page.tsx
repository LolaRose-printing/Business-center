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
  const image = await getImageById(id);

  if (!image) redirect("/404");

  const transformation = transformationTypes[image.transformationType as keyof typeof transformationTypes];

  // Safely cast or fallback your config here:
  // if config is possibly undefined/null or incompatible, fallback to empty object or null
  const config = (image.config ?? null) as typeof transformation;

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user.id} // or user._id based on your user model
          type={image.transformationType as keyof typeof transformationTypes}
          creditBalance={user.creditBalance}
          config={config}   // <- cast here
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
