export interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  currentPosition?: [number, number] | null;
  height?: string;
  zoom?: number;
  disabled?: boolean;
}

export interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  position?: [number, number] | null;
}
