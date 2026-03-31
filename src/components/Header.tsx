import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
        {/* Logo/Title：手機版縮小字體 */}
        <div className="flex items-center gap-1.5 text-gray-900">
          <span className="text-xl md:text-3xl font-bold tracking-tight">懶人食記</span>
          <span className="text-[10px] md:text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">LazyFood</span>
        </div>

        </div>

    </header>
  );
}