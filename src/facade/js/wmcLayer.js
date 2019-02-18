import namespace from 'mapea-util/decorator';
import WMCLayerImpl from 'impl/wmcLayer';

@namespace("M.layer")
export class WMCLayer extends M.layer.WMC {

    /**
     * @classdesc
     * Clase WMCLayer que extiende de M.Layer.WMC para poder tener capas WMC que no provengan o se inicialicen desde una url
     *
     * @constructor
     * @extends {M.Control}
     * @api stable
     */
    constructor (options) {
        super("http://prueba.es");
        this.url = null;
        options = (options || {});
        // 1. checks if the implementation can create PluginControl
        if (M.utils.isUndefined(M.impl.layer.WMCLayer)) {
            M.exception('La implementación usada no puede crear controles WMCLayerImpl');
        }
        // 2. implementation of this control
        let impl = new M.impl.layer.WMCLayer(options);
        this.setImpl(impl);

    }

}

