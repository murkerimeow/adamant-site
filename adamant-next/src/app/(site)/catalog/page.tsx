import { CatalogListingPage, generateCatalogMetadata } from "./CatalogListingPage";

export const dynamic = "force-dynamic";

export const generateMetadata = generateCatalogMetadata;

export default function CatalogPage() {
  return <CatalogListingPage />;
}
