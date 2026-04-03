"use client"; 

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WaterfallFeed from '@/components/WaterfallFeed';
import { Search, Navigation, MapPin } from 'lucide-react'; 

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [currentLocationName, setCurrentLocationName] = useState('我的位置');
  const [landmarkInput, setLandmarkInput] = useState('');
  
  const [searchRadius, setSearchRadius] = useState(500);

  const fetchRestaurants = async (lat: number, lng: number) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}`);
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
  };

  const getUserLocation = () => {
    setLoading(true);
    setErrorMsg('');
    setLandmarkInput(''); 
    
    if (!navigator.geolocation) {
      setErrorMsg('您的瀏覽器不支援地理定位功能');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocationName('我的位置');
        fetchRestaurants(latitude, longitude);
      },
      (error) => {
        setErrorMsg('請允許定位權限，才能幫您尋找附近美食喔！🍔');
        setLoading(false);
      }
    );
  };

  const handleSearchLandmark = async () => {
    // 必須有輸入文字才會觸發
    if (!landmarkInput.trim()) return;
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const geoRes = await fetch(`/api/landmark?q=${encodeURIComponent(landmarkInput)}`);
      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        setErrorMsg(geoData.error || '找不到該地標');
        setLoading(false);
        return;
      }

      setCurrentLocationName(geoData.name);
      fetchRestaurants(geoData.lat, geoData.lng);
      
    } catch (error) {
      setErrorMsg('地標搜尋失敗，請檢查網路');
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // 僅保留距離過濾
  const displayRestaurants = restaurants.filter(res => res.distance <= searchRadius);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-3 py-4 md:px-4 md:py-8">
        
        {/* 標題 */}
        <div className="mb-5 px-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            肚子餓了？<span className='text-orange-600'>滑滑看</span>附近好料
          </h1>
        </div>

        {/* === ✨ 全新 Google 風格搜尋與控制區塊 === */}
        <div className="space-y-3 mb-8">
          
          {/* 🔍 第一列：Google 風格搜尋框 (懸浮藥丸造型) */}
          <div className="relative flex items-center w-full h-14 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300">
            {/* 左側放大鏡 */}
            <div className="pl-5 pr-3 flex items-center justify-center text-gray-400">
              <Search size={5} />
            </div>
            
            {/* 輸入框 (背景透明，無邊框) */}
            <input
              type="text"
              placeholder="搜尋地標、捷運站、商圈..."
              value={landmarkInput}
              onChange={(e) => setLandmarkInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchLandmark()}
              className="flex-1 h-full bg-transparent text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
            
            {/* 右側內嵌搜尋按鈕 */}
            <div className="pr-0 shrink-0">
              <button
                onClick={handleSearchLandmark}
                className="h-11 w-11 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow-sm active:scale-95 transition-all inline-flex items-center justify-center"
                aria-label="搜尋"
              >
                <Search size={32} className="text-gray-300" />
              </button>
            </div>
          </div>

          {/* 📍 第二列：定位狀態與精確滑軌 (維持完美同一列) */}
          <div className="flex items-center justify-between gap-3 bg-white p-2.5 md:p-3.5 rounded-2xl border border-gray-100 shadow-sm">
            
            {/* 左側：定位點 + 目前位置 */}
            <div className="shrink-0 flex items-center gap-2 max-w-[40%]">
              {/* GPS 按鈕 */}
              <button
                onClick={getUserLocation}
                title="重新定位"
                className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition border border-gray-200 shadow-sm"
              >
                <MapPin size={18} className="text-gray-700" />
              </button>
              
              {/* 目前位置文字 (手機版顯示簡化樣式，電腦版顯示完整樣式) */}
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-gray-400 leading-tight">目前搜尋位置</span>
                <span className="text-sm font-bold text-gray-800 truncate leading-tight">
                  {currentLocationName}
                </span>
              </div>
              <div className="sm:hidden flex items-center gap-1 min-w-0 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
                <MapPin size={12} className="text-gray-500 shrink-0" />
                <span className="text-xs font-bold text-gray-700 truncate">{currentLocationName}</span>
              </div>
            </div>

            {/* 右側：動態滑軌與數值 (強制同一列，佔滿剩餘空間) */}
            <div className="flex flex-1 items-center gap-3 min-w-0">
              <input 
                type="range"
                min="100"
                max="2000"
                step="100" 
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 min-w-0"
              />
              <span className="text-sm font-extrabold text-orange-600 w-12 text-right shrink-0">
                {searchRadius < 1000
                  ? `${searchRadius}m`
                  : `${(searchRadius / 1000).toFixed(1)}km`}
              </span>
            </div>
            
          </div>

        </div>
        {/* === 控制區塊結束 === */}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-500 font-medium">正在為您搜尋 {currentLocationName} 附近的美食...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-20 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 p-8">
            <p>{errorMsg}</p>
          </div>
        ) : displayRestaurants.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <p className="text-xl font-bold mb-2 text-gray-700">這個範圍找不到符合條件的美食 😢</p>
            <p className="text-sm mb-6">試著拉遠距離，或是換個地標搜尋！</p>
          </div>
        ) : (
          <WaterfallFeed restaurants={displayRestaurants} /> 
        )}
        
        <footer className="mt-20 py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          懶人食記 © 2026 - 肚子餓的人專用
        </footer>
      </main>
    </div>
  );
}