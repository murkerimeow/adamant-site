import CatalogItemPage, {
  generateMetadata as generateCatalogItemMetadata,
} from "../../catalog-item/page";

type CatalogSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CatalogSlugPageProps) {
  const { slug } = await params;

  return generateCatalogItemMetadata({
    searchParams: Promise.resolve({ slug }),
  });
}

export default async function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  const { slug } = await params;

  return CatalogItemPage({
    searchParams: Promise.resolve({ slug }),
  });
}
