import moment from 'moment';

const formatRuntime = (runtime) => {
  const hours = moment.duration(runtime, `minutes`).hours();
  const minutes = moment.duration(runtime, `minutes`).minutes();

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatDate = (date, format = false) => {
  if (format === `comment`) {
    return moment(date).format(`YYYY/MM/DD HH:mm`);
  }

  return format ? moment(date).format(`DD MMMM YYYY`) : moment(date).year();
};

export {formatRuntime, formatDate};
