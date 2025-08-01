"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { transformationTypes } from '@/constants';

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IImage } from "@/lib/actions/image.actions";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";

import { Search } from "./Search";

interface CollectionProps {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: CollectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPageChange = (action: "next" | "prev") => {
    const pageValue = action === "next" ? page + 1 : page - 1;

    // Generate new URL with updated page query parameter
    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="collection-list">
          {images.map((image) => (
            <Card image={image} key={image.id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={page <= 1}
              className="collection-btn"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex-center p-16-medium w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={page >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({ image }: { image: IImage }) => {
  const transformationTypeKey =
    image.transformationType as keyof typeof transformationTypes;

  return (
    <li>
      <Link href={`/transformations/${image.id}`} className="collection-card">
        <CldImage
          src={image.publicId as string} // ✅ Ensure type is string
          alt={image.title}
          width={image.width || 500}
          height={image.height || 500}
          // ✅ Removed `{...image.config}` to avoid invalid props
          loading="lazy"
          className="h-52 w-full rounded-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
            {image.title}
          </p>
          <Image
            src={`/assets/icons/${
              transformationTypes[transformationTypeKey]?.icon ||
              "default-icon.svg"
            }`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};
