import {
  PortfolioListingPage,
  generatePortfolioMetadata,
} from "./PortfolioListingPage";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePortfolioMetadata;

export default function PortfolioPage() {
  return <PortfolioListingPage />;
}
