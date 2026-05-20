"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { CATEGORY_IMAGES } from "@/lib/constants";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.image_url || CATEGORY_IMAGES[category.name] || "/images/placeholder.svg";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300 animate-fade-in"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 group-hover:ring-4 ring-primary-200 dark:ring-primary-800 transition-all">
        <img
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors text-center">
        {category.name}
      </span>
    </Link>
  );
}
