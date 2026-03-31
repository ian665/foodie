"use client";

import Masonry from 'react-masonry-css';
import FoodCard from './FoodCard';
import { useState } from 'react';
import DetailModal from './DetailModel';

interface WaterfallFeedProps {
  restaurants: Array<any>;
}

export default function WaterfallFeed({ restaurants }: WaterfallFeedProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  // 🌟 確保手機版絕對是兩列的終極設定
  const breakpointColumnsObj = {
    default: 4,   // 電腦螢幕 (大於 1024px)：顯示 4 欄
    1024: 3,      // 平板螢幕 (小於 1024px)：顯示 3 欄
    768: 2        // 手機螢幕 (小於 768px)：【絕對鎖死 2 欄】
  };

  return (
    <>
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto gap-3" // 控制左右兩列的間距
      columnClassName="bg-clip-padding" 
    >
      {restaurants.map((res) => (
        <FoodCard 
        key={res.id} 
        restaurant={res} 
        onClick={() => setSelectedRestaurant(res)}
        />
      ))}
    </Masonry>

    {/* 彈出視窗元件 */}
    <DetailModal 
        isOpen={selectedRestaurant !== null} 
        onClose={() => setSelectedRestaurant(null)} // <-- 關閉時清空狀態
        restaurant={selectedRestaurant} 
      />
    </>
  );
}