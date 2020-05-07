import moment from 'moment';
import converter from 'number-to-words';

moment.updateLocale(`en`, {
  relativeTime: {
    past: `%s`,
    s: `now`,
    m: `a minute ago`,
    mm: `%d minutes ago`,
    h: `an hour ago`,
    hh: `a few hours ago`,
    d: `a day ago`,
    dd: `%d days ago`,
  }
});

moment.relativeTimeThreshold(`s`, 60);
moment.relativeTimeThreshold(`m`, 60);
moment.relativeTimeThreshold(`h`, 24);
moment.relativeTimeThreshold(`d`, Infinity);
moment.relativeTimeThreshold(`M`, null);

const formatRuntime = (runtime) => {
  const hours = moment.duration(runtime, `minutes`).hours();
  const minutes = moment.duration(runtime, `minutes`).minutes();

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatDate = (date, format = false) => {
  return format ? moment(date).format(`DD MMMM YYYY`) : moment(date).year();
};

const formatCommentDate = (date) => {
  let result = moment(date).fromNow();

  if (result.startsWith(`2 minutes`) && result.startsWith(`3 minutes`)) {
    result = `a minute ago`;
  } else if (result.includes(`minutes`)) {
    result = `a few minutes ago`;
  } else if (result.includes(`days`)) {
    const daysNumber = +result.replace(/[^\d]/g, ``);
    result = `${converter.toWords(daysNumber)} days ago`;
  }

  return result;
};

const formatRank = (watchedMoviesCount) => {
  if (!watchedMoviesCount) {
    return ``;
  } else if (watchedMoviesCount <= 10) {
    return `Novice`;
  } else if (watchedMoviesCount > 10 && watchedMoviesCount <= 20) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

export {formatRuntime, formatDate, formatCommentDate, formatRank};
