import { NextResponse } from 'next/server';

// 🌟 1. 新增：計算兩點經緯度直線距離的神奇公式 (Haversine formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // 地球半徑 (公尺)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.floor(R * c); // 算出真實公尺數並無條件捨去小數點
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');

  if (!lat || !lng) {
    return NextResponse.json({ error: '缺少經緯度' }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const googleApiUrl = 'https://places.googleapis.com/v1/places:searchNearby';

    const requestBody = {
      includedTypes: ["restaurant", "cafe", "bakery", "meal_takeaway", "bar"],
      maxResultCount: 20, // Google 鐵規定最多 20 家
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          // 🌟 2. 把範圍縮小成 800 公尺！讓 20 家店高密度集中在你身邊，不會被稀釋
          radius: 800.0 
        }
        
      },
      openNow: true, // 依然保持防白跑機制
      languageCode: "ja"
    };

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey || '',
        // 🌟 2. 關鍵更新：在最後面加上 places.location，請 Google 給我們餐廳座標
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.photos,places.reviews,places.websiteUri,places.googleMapsUri,places.regularOpeningHours,places.location,places.types',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.error) {
      console.log("新版 API 錯誤:", data.error);
      return NextResponse.json({ error: `API 錯誤: ${data.error.message}` }, { status: 400 });
    }

    const rawPlaces = data.places || [];
    const validPlaces = rawPlaces.filter((place: any) => {
      if (place.types && place.types.includes('lodging')) return false;
      return true;
    });


    const formattedRestaurants = validPlaces.map((place: any) => {
      let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop';
      let reviewImages: string[] = [imageUrl];

      if (place.photos && place.photos.length > 0) {
        reviewImages = place.photos.map((photo: any) => 
          `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=600&key=${apiKey}`
        );
        imageUrl = reviewImages[0];
      }

      let reviews = [];
      if (place.reviews && place.reviews.length > 0) {
        reviews = place.reviews.map((rev: any) => ({
          author: rev.authorAttribution?.displayName || '匿名吃貨',
          text: rev.text?.text || '只留下了星星，沒有留下評論。',
          time: rev.relativePublishTimeDescription || '' 
        }));
      }

      let openStatus = '營業狀態未知';
      let isActuallyOpen = false; 

      if (place.regularOpeningHours) {
        isActuallyOpen = place.regularOpeningHours.openNow === true;
        openStatus = isActuallyOpen ? '營業中' : '休息中';
      }

      // 🌟 3. 關鍵更新：計算真實距離
      let realDistance = 9999; // 預設一個很遠的數字防呆
      if (place.location) {
        realDistance = getDistance(lat, lng, place.location.latitude, place.location.longitude);
      }

      return {
        id: place.id,
        name: place.displayName?.text || '未知餐廳',
        imageUrl: imageUrl,
        rating: place.rating || 0,
        reviewCount: place.userRatingCount || 0,
        distance:realDistance, // 🌟 換成算出來的真實距離！不再是 Math.random 了
        reviewImages: reviewImages,
        googleMapsUri: place.googleMapsUri,
        reviews: reviews,
        menuUrl: place.websiteUri || place.googleMapsUri || null,
        openStatus: openStatus,
        isActuallyOpen: isActuallyOpen
      };
    });

    const restaurantsWithPhotos = formattedRestaurants.filter((r: any) => 
      r.imageUrl.includes('places.googleapis.com')
    );

    // 🌟 4. 加碼優化：把回傳的資料「依照距離由近到遠」排序，讓懶人少走點路！
    const sortedRestaurants = (restaurantsWithPhotos.length > 0 ? restaurantsWithPhotos : formattedRestaurants)
      .sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json(sortedRestaurants);

  } catch (error) {
    console.error("API 發生例外錯誤:", error);
    return NextResponse.json({ error: '獲取餐廳資料失敗' }, { status: 500 });
  }
}