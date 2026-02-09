import { useState } from "react";

interface District {
  name: string;
  candidates?: number;
}

// 서울시 25개 구 정보 (가나다순 정렬)
const districts: District[] = [
  { name: "강남구" }, { name: "강동구" }, { name: "강북구" },
  { name: "강서구" }, { name: "관악구" }, { name: "광진구" },
  { name: "구로구" }, { name: "금천구" }, { name: "노원구" },
  { name: "도봉구" }, { name: "동대문구" }, { name: "동작구" },
  { name: "마포구" }, { name: "서대문구" }, { name: "서초구" },
  { name: "성동구" }, { name: "성북구" }, { name: "송파구" },
  { name: "양천구" }, { name: "영등포구" }, { name: "용산구" },
  { name: "은평구" }, { name: "종로구" }, { name: "중구" },
  { name: "중랑구" }
];

export function SeoulMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          서울시 선거구별 후보자 현황
        </h2>
        
        {/* 간단한 그리드 기반 지도 표시 */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {districts.map((district) => (
            <button
              key={district.name}
              onClick={() => setSelectedDistrict(district.name)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedDistrict === district.name 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card border-border hover:border-primary hover:bg-primary/10'
                }
              `}
            >
              <div className="text-xs font-medium">{district.name}</div>
            </button>
          ))}
        </div>

        {/* 선택된 구 정보 표시 */}
        {selectedDistrict && (
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {selectedDistrict}
            </h3>
            <p className="text-sm text-muted-foreground">
              등록된 후보자가 없습니다. 후보자 등록을 기다리고 있습니다.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              * 관리자 승인 후 노출된 후보자만 표시됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
