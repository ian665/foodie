// @/components/FoodCard.tsx
import { Star, MapPin } from 'lucide-react';

interface FoodCardProps {
  restaurant: {
    id: string;
    name: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    distance: number;
    openStatus?: string;
    isActuallyOpen?: boolean;
  };
  onClick: () => void;
}

export default function FoodCard({ restaurant, onClick }: FoodCardProps) {
  return (
    <div onClick={onClick} 
    className="group break-inside-avoid mb-4 border border-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white cursor-pointer">
      {/* 食物美照區 */}
      <div className="relative overflow-hidden aspect-auto">
        {/* 注意：這裡暫時用標準 <img> 標籤，之後串接 API 會換成 Next.js 最佳化的 <Image> */}
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
          // 這行很關鍵，避免 Masonry 排版破掉
          loading="lazy"
        />
        {/* 底部漸層，讓白字更清晰 */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent"></div>
        
{/* 浮動在圖片左下角的資訊 */}
        <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full">
          <div className="flex items-center gap-1.5 mb-1">
            {/* 手機版星星縮小 */}
            <span className="flex items-center gap-1 bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
              <Star size={12} className="fill-black" />
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-[10px] md:text-xs text-white/90 shadow-black drop-shadow-md">({restaurant.reviewCount})</span>
          </div>
          {/* 手機版店名稍微縮小為 text-base (16px) */}
          <h2 className="text-base md:text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
            {restaurant.name}
          </h2>
        </div>
      </div>

      {/* 底部資訊區 */}
      <div className="p-2.5 md:p-4 flex items-center justify-between text-gray-500 text-xs md:text-sm border-t border-gray-50 bg-white">
        <div className="flex items-center gap-1">
          <MapPin size={14} className="text-orange-500" />
          <span><span className='font-bold text-gray-800'>{restaurant.distance}m</span></span>
        </div>
        
        {restaurant.isActuallyOpen ? (
          <span className="text-[10px] md:text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md font-bold border border-green-100/50 shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {restaurant.openStatus}
          </span>
        ) : (
          <span className="text-[10px] md:text-xs text-red-700 bg-red-50 px-2 py-1 rounded-md font-bold border border-red-100/50 shadow-sm flex items-center gap-1 opacity-75">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {restaurant.openStatus}
          </span>
        )}
      </div>
    </div>
  );
}