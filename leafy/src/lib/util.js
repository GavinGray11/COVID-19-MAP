/**
 * isDomAvailable
 * @description Checks to see if the DOM is available by checking the existence of the window and document
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */

export function isDomAvailable() {
  return (
    typeof window !== "undefined" &&
    !!window.document &&
    !!window.document.createElement
  );
}

export function commafy(value) { 
  let s = `${value}`;
  
  s = s.split('');
  s.reverse();

  s = s.reduce((prev, current, index) => {
    const shouldComma = (index + 1) % 3 === 0 && 
                        index + 1 < s.length;
    let update = `${prev}${current}`
    if (shouldComma) { update = `${update},` }
    return update;
  }, '');

  s = s.split('');
  s.reverse();
  s = s.join('');

  return s;
}

export function friendlyDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-GB', {

    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}