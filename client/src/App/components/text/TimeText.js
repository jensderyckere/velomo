// Moment.js
import Moment from 'moment';
import 'moment/locale/nl-be';

export const TimeText = (date) => {
  Moment.locale('nl-be');

  return Moment(date).format('LT');
};
