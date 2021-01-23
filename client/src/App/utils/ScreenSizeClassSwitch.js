// Services
import { useStyling } from '../services';

export const ScreenSizeClassSwitch = (whenLarge, whenSmall) => {
  const { screenSize } = useStyling();

  return screenSize === 'lg' ? whenLarge : screenSize === 'xl' ? whenLarge : whenSmall;
};
