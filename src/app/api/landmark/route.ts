import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q'); 

  if (!query) {
    return NextResponse.json({ error: '請輸入地標' }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const googleApiUrl = 'https://places.googleapis.com/v1/places:searchText';

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey || '',
        'X-Goog-FieldMask': 'places.displayName,places.location',
      },
      body: JSON.stringify({ 
        textQuery: query,
        languageCode: "zh-TW" 
      })
    });

    const data = await response.json();

    if (data.error) {
      console.log("❌ Google 地標 API 報錯了:", data.error);
      return NextResponse.json({ error: `API 錯誤: ${data.error.message}` }, { status: 400 });
    }

    if (!data.places || data.places.length === 0) {
      return NextResponse.json({ error: '找不到這個地標，請換個關鍵字試試看' }, { status: 404 });
    }

    const bestMatch = data.places[0];
    
    // 把地標名稱跟經緯度傳給前端
    return NextResponse.json({
      name: bestMatch.displayName?.text,
      lat: bestMatch.location.latitude,
      lng: bestMatch.location.longitude
    });

  } catch (error) {
    console.error("地標 API 發生錯誤:", error);
    return NextResponse.json({ error: '地標解析失敗' }, { status: 500 });
  }
}