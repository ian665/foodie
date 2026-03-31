// 🌟 1. 頂部 import 新增 BookOpen (書本圖示代表菜單)
import { X, Star, Map, MessageCircle, Navigation, Image as ImageIcon, BookOpen } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: any;
}

export default function DetailModal({ isOpen, onClose, restaurant }: DetailModalProps) {
  if (!isOpen || !restaurant) return null;

  const handleNavigation = () => {
    if (!restaurant) return;

    // 優先使用 Google API 回傳的官方連結 (googleMapsUri)
    // 如果因為某些原因沒抓到，則使用 Place ID 或店名進行備援搜尋
    const finalUrl = restaurant.googleMapsUri || 
                     `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`;
    
    window.open(finalUrl, '_blank');
  };

  const imagesToShow = restaurant.reviewImages || [restaurant.imageUrl];

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full md:w-[480px] max-h-[90vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl transform transition-transform relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* 頂部圖片輪播區塊 (維持不變) */}
        <div className="relative h-64 md:h-72 w-full shrink-0 bg-gray-900">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory h-full w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {imagesToShow.map((img: string, index: number) => (
              <div key={index} className="min-w-full h-full snap-center relative">
                <img 
                  src={img} 
                  alt={`${restaurant.name} 評論照片 ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {imagesToShow.length > 1 && (
             <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
               <ImageIcon size={14} />
               <span>左右滑動</span>
             </div>
          )}

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/70 transition z-10"
          >
            <X size={20} />
          </button>
          
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-12 pointer-events-none">
            <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
              {restaurant.name}
            </h2>
          </div>
        </div>

        {/* 可滾動的資訊區 */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
          
          {/* 🌟 2. 替換成方案 B 的輕量整合型標籤列 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* 星級標籤 */}
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-gray-800 text-sm">
              <Star size={16} className="fill-yellow-400 text-yellow-400" /> 
              {restaurant.rating.toFixed(1)} <span className="text-xs text-gray-400 font-normal">({restaurant.reviewCount})</span>
            </div>
            
            {/* 距離標籤 */}
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-gray-800 text-sm">
              <Map size={16} className="text-orange-500" /> 
              {restaurant.distance}m
            </div>

            {/* 菜單/官網標籤 (只有在有網址時才顯示，並給予橘色特別強調) */}
            {restaurant.menuUrl && (
              <a 
                href={restaurant.menuUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-xl shadow-sm border border-orange-100 font-bold text-orange-600 text-sm transition-colors active:scale-95 cursor-pointer"
              >
                <BookOpen size={16} />
                看菜單
              </a>
            )}
          </div>

          {/* 鄉民熱門短評區塊 (維持不變) */}
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MessageCircle size={16} className="text-gray-400" />
            Google 評價
          </h3>
          <div className="space-y-3 mb-6">
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review: any, index: number) => (
                <div key={index} className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-50 text-sm text-gray-600">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800">👤 {review.author}</span>
                    <span className="text-xs text-gray-400">{review.time}</span>
                  </div>
                  <p className="line-clamp-4 leading-relaxed mt-1">
                    "{review.text}"
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 text-sm text-gray-400 text-center italic">
                目前還沒有文字評論喔！直接去踩點當頭香吧🏃‍♂️
              </div>
            )}
          </div>
        </div>

        {/* 底部導航大按鈕 (維持不變) */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <button 
            onClick={handleNavigation}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Navigation size={22} className="fill-white" />
            Google Map
          </button>
        </div>
      </div>
    </div>
  );
}