import {div, ul, li, a} from '@cycle/dom';

function Repos({sources, props$}) {
  const starredRequest$ = props$
    .map(username => ({
      url: 'https://api.github.com/users/' + encodeURI(username) + '/starred',
      category: 'starred',
    }));

  const vtree$ = sources.HTTP_STARRED
    .filter(res$ => res$.request.category === 'starred')
    .mergeAll()
    .map(res => res.body)
    .startWith([])
    .map(results =>
      div([
        ul({className: 'search-results'}, results.map(result =>
          li({className: 'search-result'}, [
            a({href: result.html_url}, result.name),
          ])
        ))
      ])
    );

  return {
    DOM: vtree$,
    HTTP: starredRequest$
  };
}

export default Repos;
