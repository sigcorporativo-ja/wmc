import WmcLayerImpl from 'impl/wmclayer';

export default class WmcLayer extends M.layer.WMC {
  /**
   * @classdesc
   * Clase WMCLayer que extiende de M.Layer.WMC para poder tener capas WMC
   * que no provengan o se inicialicen desde una url
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(options = {}) {
    super('http://prueba.es');
    this.url = null;
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(WmcLayerImpl)) {
      M.exception('La implementación usada no puede crear controles WMCLayerImpl');
    }
    // 2. implementation of this control
    const impl = new M.impl.layer.WMCLayer(options);
    this.setImpl(impl);
  }
}
