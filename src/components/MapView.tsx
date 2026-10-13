import React, { useState } from 'react';
import { Nursery } from '../types.ts';
import { AppIcon } from './AppIcon.tsx';

interface MapViewProps {
  nurseries: Nursery[];
  onSelectNursery: (nursery: Nursery) => void;
  onBookTour: (nursery: Nursery) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  nurseries,
  onSelectNursery,
  onBookTour
}) => {
  const [selectedPin, setSelectedPin] = useState<Nursery | null>(nurseries[0] || null);
  const [selectedCityMap, setSelectedCityMap] = useState<string>('all');

  const filteredNurseries = selectedCityMap === 'all'
    ? nurseries
    : nurseries.filter((n) => n.city === selectedCityMap);

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-[#e5eeff] shadow-sm flex flex-col lg:flex-row h-[620px]">
      {/* Interactive Map Canvas Simulation */}
      <div className="relative flex-1 bg-[#eff4ff] overflow-hidden flex items-center justify-center">
        {/* Stylized Map Background Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#00685f_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* City Filter Pills inside Map */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-[#e5eeff]">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'riyadh', label: 'الرياض' },
            { id: 'jeddah', label: 'جدة' },
            { id: 'khobar', label: 'الشرقية' },
            { id: 'makkah', label: 'مكة' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCityMap(c.id)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCityMap === c.id
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#3d4947] hover:bg-[#e5eeff]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Map Center Decorative Roads / Boundaries */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50 150 Q 250 120 400 300 T 800 450" fill="none" stroke="#00685f" strokeWidth="4" />
          <path d="M 200 50 Q 300 300 650 350 T 900 200" fill="none" stroke="#00685f" strokeWidth="3" strokeDasharray="6,6" />
          <path d="M 100 500 Q 450 400 700 150" fill="none" stroke="#fea619" strokeWidth="3" />
        </svg>

        {/* Map Pins */}
        <div className="relative w-full h-full">
          {filteredNurseries.map((n, idx) => {
            // Position pins nicely across the canvas based on index / city
            const positions = [
              { top: '35%', left: '48%' }, // Riyadh
              { top: '65%', left: '25%' }, // Jeddah
              { top: '28%', left: '72%' }, // Khobar
              { top: '42%', left: '55%' }, // Riyadh 2
              { top: '22%', left: '78%' }, // Dammam
              { top: '72%', left: '30%' }, // Makkah
              { top: '38%', left: '42%' }, // Riyadh 3
              { top: '60%', left: '20%' }, // Jeddah 2
            ];
            const pos = positions[idx % positions.length];
            const isSelected = selectedPin?.id === n.id;

            return (
              <div
                key={n.id}
                style={{ top: pos.top, left: pos.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-200"
              >
                <button
                  onClick={() => setSelectedPin(n)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md font-bold text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00685f] text-white scale-110 ring-4 ring-[#89f5e7]'
                      : 'bg-white text-[#0b1c30] hover:scale-105 hover:bg-[#eff4ff]'
                  }`}
                >
                  <AppIcon
                    name="location_on"
                    className={`w-4 h-4 ${
                      isSelected ? 'text-[#fea619]' : 'text-[#00685f]'
                    }`}
                  />
                  <span className="truncate max-w-[110px]">{n.name}</span>
                  <span className="text-[10px] opacity-80">{n.price} ر.س</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1 bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-sm border border-[#e5eeff]">
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer text-base font-bold">
            +
          </button>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer text-base font-bold">
            -
          </button>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#00685f] hover:bg-[#eff4ff] cursor-pointer" title="تحديد موقعي">
            <AppIcon name="location_on" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Nursery Sidebar on Map */}
      <div className="w-full lg:w-96 p-4 lg:p-6 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-[#e5eeff] overflow-y-auto">
        {selectedPin ? (
          <div className="space-y-4">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-[#e5eeff]">
              <img
                src={selectedPin.image}
                alt={selectedPin.name}
                className="w-full h-full object-cover"
              />
              {selectedPin.badge && (
                <div className="absolute top-2.5 right-2.5 bg-[#fea619] text-[#684000] px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
                  <span>{selectedPin.badge.text}</span>
                </div>
              )}
              <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 text-xs font-bold text-[#0b1c30]">
                <AppIcon name="star" className="w-3.5 h-3.5 text-[#fea619]" filled />
                <span>{selectedPin.rating.toFixed(1)}</span>
                <span className="text-[#6d7a77]">({selectedPin.reviewsCount})</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">{selectedPin.name}</h3>
              <p className="text-xs text-[#6d7a77] mt-1 flex items-center gap-1">
                <AppIcon name="location_on" className="w-4 h-4 text-[#00685f]" />
                <span>{selectedPin.cityName}، {selectedPin.district} - تبعد {selectedPin.distance}</span>
              </p>
            </div>

            <p className="text-xs text-[#3d4947] leading-relaxed line-clamp-3">
              {selectedPin.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {selectedPin.tags.map((t, idx) => (
                <span key={idx} className="bg-[#eff4ff] text-[#00685f] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6d7a77] block">الرسوم الشهرية</span>
                <span className="text-base font-bold text-[#00685f]">{selectedPin.price.toLocaleString()} ر.س</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectNursery(selectedPin)}
                  className="px-3 py-2 rounded-xl bg-[#eff4ff] text-[#00685f] hover:bg-[#e5eeff] text-xs font-bold cursor-pointer"
                >
                  التفاصيل
                </button>
                <button
                  onClick={() => onBookTour(selectedPin)}
                  className="px-3.5 py-2 rounded-xl bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  حجز جولة
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 text-[#6d7a77]">
            <AppIcon name="map" className="w-9 h-9 text-[#00685f] mb-2" />
            <p className="text-sm">انقري على أي حضانة على الخريطة لعرض تفاصيلها وموقعها الدقيق</p>
          </div>
        )}
      </div>
    </div>
  );
};
