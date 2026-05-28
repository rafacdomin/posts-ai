import { readStyleGuide } from "@/services/style";
import { getMockData } from "@/services/ai";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const initialStyleGuide = await readStyleGuide();
  const mockData = await getMockData();
  return (
    <Dashboard
      initialStyleGuide={initialStyleGuide}
      mockHtml={mockData.html}
    />
  );
}
