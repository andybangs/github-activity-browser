import { div, ul, li, a, img } from '@cycle/dom';

function Following({sources, props$}) {
  const followingRequest$ = props$
    .map(username => ({
      url: 'https://api.github.com/users/' + encodeURI(username) + '/following',
      category: 'following',
    }));

  const vtree$ = sources.HTTP_FOLLOWING
    .filter(res$ => res$.request.category === 'following')
    .mergeAll()
    .map(res => res.body)
    .startWith([])
    .map(results => {
      const sortedResults = results
        .map(user => {
          return Object.assign({}, {
            login: user.login.toLowerCase(),
            avatar_url: user.avatar_url,
            html_url: user.html_url,
          });
        })
        .sort((a, b) => {
          if (a.login > b.login) return 1;
          if (a.login < b.login) return -1;
          return 0;
        });

      return div([
        ul({className: 'search-results'}, sortedResults.map(result =>
          li({className: 'search-result'}, [
            img({src: result.avatar_url, alt: result.login, height: "42", width: "42"}),
            a({href: result.html_url}, result.login),
          ])
        ))
      ])
    });

  return {
    DOM: vtree$,
    HTTP: followingRequest$
  };
}

export default Following;
