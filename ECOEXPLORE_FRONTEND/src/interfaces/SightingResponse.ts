interface SightingResponse {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  ecosystem_id: number;
  ecosystem_name: string;
  location_id: number;
  location_name: string;
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
