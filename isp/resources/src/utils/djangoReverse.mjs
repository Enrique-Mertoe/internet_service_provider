import _ from 'lodash/fp';
import djangoJsReverse from 'django-js-reverse';

export default _.once(
  async () => {
    const res = await fetch('/jsreverse.json');
    const data = await res.json();
    return djangoJsReverse(data);
  }
)