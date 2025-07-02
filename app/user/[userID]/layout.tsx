import { DashboardPanel } from "../../components/DashboardPanel";

export default async function DashboardPaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-dvw h-dvh">
      <DashboardPanel />
      {children}
    </div>
  );
}
