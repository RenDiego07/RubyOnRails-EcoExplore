import { getSightings, getMySightings } from './GET/sightingsGet';
import { createSighting } from './POST/sightingsPost';

const CRUDSightings = {
  getAll: getSightings,
  getMySightings: getMySightings,
  create: createSighting,
};

export default CRUDSightings;
