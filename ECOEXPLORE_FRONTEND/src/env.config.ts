const { VITE_BACKEND_URL, VITE_NODE_ENV } = import.meta.env;

export const EnvConfig = {
  back_end_url: VITE_BACKEND_URL,
  node_env: VITE_NODE_ENV || 'development',
};

export function isProduction(): boolean {
  return EnvConfig.node_env === 'production';
}
