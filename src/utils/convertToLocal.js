import moment from 'moment';
 const ConvertLocalFormat = (item) => {
  if (!item) return null;
  const localDateTime = moment(item).add(5.5, 'hours');
  return localDateTime.format("DD-MM-YYYY HH:mm");
}
export default ConvertLocalFormat;