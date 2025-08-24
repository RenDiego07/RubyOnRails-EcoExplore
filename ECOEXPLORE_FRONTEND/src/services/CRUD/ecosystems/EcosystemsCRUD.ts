import { fetchEcosystems, fetchEcosystemById } from './GET/EcosystemsGet';

const CRUDEcosystems = {
  getAll: fetchEcosystems,
  getById: fetchEcosystemById,
};

export default CRUDEcosystems;
