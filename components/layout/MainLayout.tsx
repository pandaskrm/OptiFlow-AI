import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <div className="px-5 py-4 lg:px-6 lg:py-5">
          {children}
        </div>
      </div>
    </main>
  );
}
