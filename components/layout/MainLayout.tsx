import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-8">
          {children}
        </div>
      </div>
    </main>
  );
}