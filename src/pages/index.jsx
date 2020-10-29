import bluebird from 'bluebird';
import uuid from 'react-uuid';
import redis from 'redis';

const fetchData = async (url) => {
  console.log('fetching...');
  const query = await fetch(url);
  return await query.json();
};

export const getStaticProps = async () => {
  bluebird.promisifyAll(redis.RedisClient.prototype);
  const cache = redis.createClient();
  let data = {};

  await cache.existsAsync('exp-articles').then(async reply => {
    if (reply !== 1) { // cache miss, need to fetch
      data = await fetchData('https://www.healthcare.gov/api/articles.json');
      await cache.set('exp-articles', JSON.stringify(data), 'EX', 60 * 60);
    } else { // cache hit, will get data from redis
      data = JSON.parse(await cache.getAsync('exp-articles'));
    }
  });

  return {
    props: {
      articles: data.articles,
    },
  };
};

const Home = ({ articles }) => (
  <article>
    <h1>HealthCare.gov Articles:</h1>
    <table>
      <thead>
        <tr>
          <th>Language</th>
          <th>Article</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {articles && articles.length > 0 && articles.map((el) => (
          <tr key={uuid()}>
            <td>{el.lang}</td>
            <td>
              <a href={'https://www.healthcare.gov' + el.url} target="_blank">{el.title}</a>
            </td>
            <td>
              {el.date}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </article>
);

export default Home;