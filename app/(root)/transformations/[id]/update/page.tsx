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

  if (!image) {
    redirect("/404");
  }

  const transformation =
    transformationTypes[image.transformationType as keyof typeof transformationTypes];

  // Safely cast config to the expected type or provide default empty object
  const config =
    typeof image.config === "object" && image.config !== null
      ? (image.config as Record<string, any>)
      : {};

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user.id} // adjust if user model uses _id instead
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
