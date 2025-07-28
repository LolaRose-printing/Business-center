import Image from "next/image";
import Link from "next/link";

import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/actions/image.actions";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import { redirect } from "next/navigation";

type SearchParamProps = {
  params: {
    id: string;
  };
};

// Define a type for your transformations config expected by TransformedImage
// Adjust this to match what TransformedImage expects
type Transformations = {
  [key: string]: any;
};

async function getCurrentUserId() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.userId;
}

const ImageDetails = async ({ params: { id } }: SearchParamProps) => {
  const userId = await getCurrentUserId();

  if (!userId) redirect("/sign-in"); // redirect if not logged in

  const image = await getImageById(id);

  if (!image) {
    // You might want to redirect or render 404 here
    redirect("/404");
  }

  // Cast config to expected type, or fallback to null
  const transformationConfig: Transformations | null =
    typeof image.config === "object" && image.config !== null
      ? (image.config as Transformations)
      : null;

  return (
    <>
      <Header title={image.title} />

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="text-dark-600">Transformation:</p>
          <p className="capitalize text-purple-400">{image.transformationType}</p>
        </div>

        {/* Optionally render prompt, color, aspectRatio if present */}
        {image.prompt && (
          <div className="p-14-medium md:p-16-medium">
            <strong>Prompt: </strong> {image.prompt}
          </div>
        )}
        {image.color && (
          <div className="p-14-medium md:p-16-medium">
            <strong>Color: </strong> {image.color}
          </div>
        )}
        {image.aspectRatio && (
          <div className="p-14-medium md:p-16-medium">
            <strong>Aspect Ratio: </strong> {image.aspectRatio}
          </div>
        )}
      </section>

      <section className="mt-10 border-t border-dark-400/15">
        <div className="transformation-grid">
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            <Image
              width={getImageSize(image.transformationType, image, "width")}
              height={getImageSize(image.transformationType, image, "height")}
              src={image.secureURL}
              alt={image.title}
              className="transformation-original_image"
            />
          </div>

          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            isTransforming={false}
            transformationConfig={transformationConfig}
            hasDownload={true}
          />
        </div>

        {userId === image.author?.id /* Adjust based on your user id field */ && (
          <div className="mt-4 space-y-4">
            <Button asChild type="button" className="submit-button capitalize">
              <Link href={`/transformations/${image.id}/update`}>Update Image</Link>
            </Button>

            <DeleteConfirmation imageId={image.id} />
          </div>
        )}
      </section>
    </>
  );
};

export default ImageDetails;
