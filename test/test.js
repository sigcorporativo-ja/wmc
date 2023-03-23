import Wmc from 'facade/wmc';

const map = M.map({
  container: 'mapjs',
  controls: ['mouse','layerswitcher']
});

const mp = new Wmc();

map.addPlugin(mp);
