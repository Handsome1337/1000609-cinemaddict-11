const MINUTES_IN_HOUR = 60;
const MONTH_NAMES = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];

const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / MINUTES_IN_HOUR);
  const minutes = runtime - hours * MINUTES_IN_HOUR;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const castDateFormat = (value) => value < 10 ? `0${value}` : String(value);

const formatDate = (date, format = false) => {
  const year = date.getFullYear();

  const month = date.getMonth();
  const day = castDateFormat(date.getDate());
  const hour = date.getHours();
  const minute = castDateFormat(date.getMinutes());

  if (format === `comment`) {
    return `${year}/${castDateFormat(month + 1)}/${day} ${hour}:${minute}`;
  }

  return format ? `${day} ${MONTH_NAMES[month]} ${year}` : `${year}`;
};

export {formatRuntime, formatDate};
