import { Collection } from "@/components/shared/Collection";
import { externalNavLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions"; // ✅ Make sure this is correct
import Image from "next/image";

interface SearchParamProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Your Partner in Business Growth & Print Solutions
        </h1>
        <ul className="flex-center w-full gap-20">
          {externalNavLinks.map((link) => (
            <li key={link.url} className="flex-center flex-col gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-center flex-col gap-2"
              >
                <div className="flex-center w-fit rounded-full bg-white p-4">
                  <Image
                    src={link.icon}
                    alt={link.label}
                    width={24}
                    height={24}
                  />
                </div>
                <p className="p-14-medium text-center text-white">
                  {link.label}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data ?? []}          // ✅ fallback to empty array
          totalPages={images?.totalPages ?? 1}  // ✅ make sure this is totalPages not totalPage!
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
