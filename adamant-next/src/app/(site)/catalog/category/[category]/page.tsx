import {
  CatalogListingPage,
  generateCatalogCategoryMetadata,
} from "../../CatalogListingPage";

type CatalogCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CatalogCategoryPageProps) {
  const { category } = await params;

  return generateCatalogCategoryMetadata(category);
}

export default async function CatalogCategoryPage({ params }: CatalogCategoryPageProps) {
  const { category } = await params;

  return <CatalogListingPage categorySlug={category} />;
}
