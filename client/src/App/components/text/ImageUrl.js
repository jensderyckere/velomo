import * as Config from '../../config';

export const ImageUrl = (user, defaultImg) => {
  return user ? `${Config.clientConfig.apiUrl}picture/${user}` : defaultImg;
};