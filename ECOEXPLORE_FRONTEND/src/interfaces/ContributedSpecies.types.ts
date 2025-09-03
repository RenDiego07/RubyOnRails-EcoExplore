export interface ContributedSpeciesResponse {
  id: number;
  name: string;
  description: string;
  type_specie_id: number;
  type_specie_name: string;
  type_specie_code: string;
  location: string;
  location_coordinates: string;
  ecosystem_name: string;
  sighting_description: string;
  image_path?: string;
  specie_field?: string;
  contributed_date: string;
  total_sightings: number;
}

export interface ContributedSpeciesData {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  image_url?: string;
  ecosystem_name: string;
  type_specie_name: string;
  sighting_description: string;
  contributed_date: string;
  total_sightings: number;
}
