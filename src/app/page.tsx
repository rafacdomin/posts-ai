import { readStyleGuide } from "@/services/style";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const initialStyleGuide = await readStyleGuide();
  return <Dashboard initialStyleGuide={initialStyleGuide} />;
}
