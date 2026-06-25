import {
  PortfolioListingPage,
  generatePortfolioCategoryMetadata,
} from "../../PortfolioListingPage";

type PortfolioCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PortfolioCategoryPageProps) {
  const { category } = await params;

  return generatePortfolioCategoryMetadata(category);
}

export default async function PortfolioCategoryPage({
  params,
}: PortfolioCategoryPageProps) {
  const { category } = await params;

  return <PortfolioListingPage categorySlug={category} />;
}
