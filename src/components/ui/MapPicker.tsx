"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultCenter?: [number, number];
}

export default function MapPicker({ onLocationSelect, defaultCenter = [30.5877, 31.5010] }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [address, setAddress] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load Leaflet CSS dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      const leafletMap = L.map(containerRef.current!, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
      });
      mapInstanceRef.current = leafletMap;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(leafletMap);

      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const placedMarker = L.marker(defaultCenter, { icon: defaultIcon, draggable: true }).addTo(leafletMap);
      markerRef.current = placedMarker;

      placedMarker.on("dragend", async () => {
        const pos = placedMarker.getLatLng();
        await reverseGeocode(pos.lat, pos.lng);
      });

      leafletMap.on("click", async (e: any) => {
        placedMarker.setLatLng(e.latlng);
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      await reverseGeocode(defaultCenter[0], defaultCenter[1]);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await res.json();
      const addr = data.display_name || "الموقع المحدد";
      setAddress(addr);
      onLocationSelect(lat, lng, addr);
    } catch {
      const addr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(addr);
      onLocationSelect(lat, lng, addr);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-5 h-5" />
          <span>جاري تحميل الخريطة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="w-full h-64 md:h-80 rounded-xl border border-gray-200 dark:border-gray-700 z-0" />
      {address && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MapPin className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{address}</p>
        </div>
      )}
    </div>
  );
}
