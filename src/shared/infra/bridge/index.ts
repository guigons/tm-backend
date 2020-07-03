import 'dotenv/config';
import axios from 'axios';
import bridgeConfig from '@config/bridge';

const api = axios.create({
  baseURL: bridgeConfig.bridge_url,
  headers: {
    authorization: `Bearer ${bridgeConfig.bridge_secret}`,
  },
});

export default api;
