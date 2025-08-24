interface CreateSightingParams {
  ecosystem_id: number;
  description: string;
  location_name: string;
  coordinates?: string;
  image_path?: string;
  specie: string;
}
export default CreateSightingParams;
