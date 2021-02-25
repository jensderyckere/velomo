import * as Config from '../../config';

export const VideoUrl = (video) => {
  return video ? `${Config.clientConfig.apiUrl}video/${video}` : '';
};
