import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { MapPickerProps, LocationMarkerProps } from './MapPicker.types';
import 'leaflet/dist/leaflet.css';
import styles from './MapPicker.module.css';

// Fix para los iconos de Leaflet en Vite/Webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect, position: initialPosition }: LocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition: [number, number] = [lat, lng];
      setPosition(newPosition);
      onLocationSelect(lat, lng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.flyTo(initialPosition, map.getZoom());
    }
  }, [initialPosition, map]);

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({
  onLocationSelect,
  initialPosition = [-0.1807, -78.4678], // Ecuador como posición por defecto
  currentPosition = null,
  height = '400px',
  zoom = 13,
  disabled = false,
}: MapPickerProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Función para obtener la ubicación actual del usuario
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newPosition: [number, number] = [lat, lng];
        setUserLocation(newPosition);
        onLocationSelect(lat, lng);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación actual');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  };

  const displayPosition = currentPosition || userLocation || initialPosition;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapControls}>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={disabled || isLoadingLocation}
          className={styles.locationButton}
        >
          {isLoadingLocation ? '📍 Obteniendo...' : '📍 Usar mi ubicación'}
        </button>
        <p className={styles.instructions}>
          💡 Haz clic en el mapa para seleccionar la ubicación del avistamiento
        </p>
      </div>

      <div className={styles.mapWrapper} style={{ height }}>
        {disabled && <div className={styles.mapOverlay} />}
        <MapContainer
          center={displayPosition}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className={styles.leafletMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker onLocationSelect={onLocationSelect} position={currentPosition} />
        </MapContainer>
      </div>

      {currentPosition && (
        <div className={styles.coordinatesDisplay}>
          <span className={styles.coordinatesLabel}>📍 Coordenadas seleccionadas:</span>
          <span className={styles.coordinatesValue}>
            {currentPosition[0].toFixed(6)}, {currentPosition[1].toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
}
