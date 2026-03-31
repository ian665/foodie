"use client"; 

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WaterfallFeed from '@/components/WaterfallFeed';

// 保留假資料，作為防呆備用
const mockRestaurants = [
  {
    id: '1', name: '隱藏版濃厚豚骨拉麵 - 豚骨屋', rating: 4.8, reviewCount: 256, distance: 150,
    imageUrl: 'https://images.unsplash.com/photo-1591814468923-cafb57c0d724?q=80&w=600&h=800&auto=format&fit=crop',
    reviewImages: ['https://images.unsplash.com/photo-1591814468923-cafb57c0d724?q=80&w=600&h=800&auto=format&fit=crop']
  },
  {
    id: '2', name: '街角手作日式壽司壽司', rating: 4.5, reviewCount: 128, distance: 400,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&h=400&auto=format&fit=crop',
    reviewImages: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&h=400&auto=format&fit=crop']
  },
  {
    id: '3', name: '網美最愛！法式千層蛋糕專賣店', rating: 4.7, reviewCount: 198, distance: 210,
    imageUrl: 'https://images.unsplash.com/photo-1586985289906-406988974504?q=80&w=600&h=900&auto=format&fit=crop',
    reviewImages: ['https://images.unsplash.com/photo-1586985289906-406988974504?q=80&w=600&h=900&auto=format&fit=crop']
  },
  {
    id: '4', name: '道地美式起司漢堡堡🍔', rating: 4.2, reviewCount: 95, distance: 300,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&h=600&auto=format&fit=crop',
    reviewImages: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&h=600&auto=format&fit=crop']
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 🌟 滑軌與防雷狀態控管
  const [searchRadius, setSearchRadius] = useState(500); // 預設 500m
  const [highRatingOnly, setHighRatingOnly] = useState(false); // 預設關閉，顯示全部

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('您的瀏覽器不支援地理定位功能');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 注意：如果後端有配合，這裡可以把 radius 也傳過去，目前先讓前端即時過濾
          const response = await fetch(`/api/restaurants?lat=${latitude}&lng=${longitude}`);
          const data = await response.json();
          
          if (response.ok) {
            setRestaurants(data); 
          } else {
            setErrorMsg(data.error || '無法取得餐廳資料');
          }
        } catch (error) {
          setErrorMsg('網路發生錯誤，請檢查連線');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setErrorMsg('請允許定位權限，才能幫您尋找附近美食喔！🍔');
        setLoading(false);
      }
    );
  }, []);

  // 🌟 前端過濾邏輯：根據距離滑軌和評分開關，即時篩選畫面上的資料
  const displayRestaurants = restaurants.filter(res => {
    const passDistance = res.distance <= searchRadius;
    const passRating = highRatingOnly ? res.rating >= 4.0 : true;
    return passDistance && passRating;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-3 py-4 md:px-4 md:py-8">
        
        {/* 🌟 頂部標題與升級版篩選列 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            肚子餓了？<span className='text-orange-600'>滑滑看</span>附近好料
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            
            {/* 📍 距離滑軌區塊 */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-100 w-full sm:w-auto">
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap w-20">
                📍 {searchRadius < 1000 ? `${searchRadius}m` : `${(searchRadius/1000).toFixed(1)}km`}
              </span>
              <input 
                type="range" 
                min="100" 
                max="2000" 
                step="100" 
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-32 md:w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* ⭐ 一鍵防雷開關 */}
            <button 
              onClick={() => setHighRatingOnly(!highRatingOnly)}
              className={`whitespace-nowrap text-sm px-4 py-2.5 rounded-full shadow-sm border font-bold transition-all active:scale-95 flex-shrink-0 ${
                highRatingOnly 
                  ? 'bg-orange-50 border-orange-200 text-orange-600' 
                  : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50' 
              }`}
            >
              {highRatingOnly ? '4.0星以上' : '所有評分'}
            </button>
            
          </div>
        </div>

        {/* 狀態呈現邏輯更新 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-500 font-medium">正在定位並尋找附近美食...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-20 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 p-8 flex flex-col items-center">
            <p>{errorMsg}</p>
            <button 
              onClick={() => { setErrorMsg(''); setRestaurants(mockRestaurants); }}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition"
            >
              先看測試資料解解饞
            </button>
          </div>
        ) : displayRestaurants.length === 0 ? ( 
          // 🌟 防呆：如果 API 成功但過濾後沒資料
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <p className="text-xl font-bold mb-2 text-gray-700">這個範圍找不到符合條件的美食 😢</p>
            <p className="text-sm mb-6">試著把「距離滑軌」拉遠一點，或是關閉「防雷開關」看看！</p>
            <button 
              onClick={() => { setRestaurants(mockRestaurants); setSearchRadius(2000); setHighRatingOnly(false); }}
              className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition shadow-md"
            >
              看測試資料過過乾癮
            </button>
          </div>
        ) : (
          // 🌟 傳入過濾後的資料
          <WaterfallFeed restaurants={displayRestaurants} /> 
        )}
        
        <footer className="mt-20 py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          懶人食記 © 2026 - 肚子餓的人專用
        </footer>
      </main>
    </div>
  );
}