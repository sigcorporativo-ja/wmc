import Wmc from 'facade/wmc';

const map = M.map({
  container: 'mapjs',
});

const mp = new Wmc();

map.addPlugin(mp);
