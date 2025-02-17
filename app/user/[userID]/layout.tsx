import { DashboardPanel } from "../../components/DashboardPanel";

export default function DDashboardPanelardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-dvw">
      <DashboardPanel />
      {children}
    </div>
  );
}
