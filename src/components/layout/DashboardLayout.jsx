import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#0a0f1f]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        <Header />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}