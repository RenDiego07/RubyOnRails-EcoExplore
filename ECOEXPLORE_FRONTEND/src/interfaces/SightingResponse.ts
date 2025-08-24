interface SightingResponse {
  id: number;
  user_id: number;
  ecosystem_id: number;
  location_id: number;
  sighting_state_id: number;
  sighting_state_name: string;
  sighting_location: string;
  sighting_location_coordinates: string;
  description: string;
  image_path?: string;
  specie?: string;
  created_at: string;
}
export default SightingResponse;
