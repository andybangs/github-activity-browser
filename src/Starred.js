import { div, ul, li, a } from '@cycle/dom';

function Starred({sources, props$}) {
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
      div({}, [
        ul({style: styles.ul}, results.map(result =>
          li({style: styles.li}, [
            a({style: styles.a, href: result.html_url}, result.name),
          ])
        ))
      ])
    );

  const styles = {
    ul: {
      display: 'flex',
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5px',
    },
    li: {
      listStyle: 'none',
      padding: '10px',
      margin: '5px',
      borderRadius: '2px',
      backgroundColor: '#90A6C1',
    },
    a: {
      textDecoration: 'none',
      color: '#444343',
    }
  };

  return {
    DOM: vtree$,
    HTTP: starredRequest$
  };
}

export default Starred;
