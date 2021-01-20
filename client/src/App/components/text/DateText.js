// Moment.js
import Moment from 'moment';
import 'moment/locale/nl-be';

export const DateText = ({date}) => {
  Moment.locale('nl-be');

  return Moment(date).format('LL');
};
