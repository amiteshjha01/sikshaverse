import Sidebar from "@/components/Sidebar";

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-[calc(100vh-76px)]">
        {children}
      </div>
    </div>
  );
}
