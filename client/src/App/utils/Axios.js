import axios from 'axios';

// Config
import * as Config from '../config';

export const axiosInstance = axios.create({
  baseURL: Config.clientConfig.apiUrl,
});
