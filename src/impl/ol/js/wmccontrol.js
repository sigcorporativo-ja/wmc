/**
 * @module M/impl/control/WmcControl
 */
export default class WmcControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    this.element = html;

    const olMap = map.getMapImpl();
    ol.control.Control.call(this, {
      element: html,
      target: null,
    });
    olMap.addControl(this);

    // super addTo - don't delete
    super.addTo(map, html);
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  activate() {}

  /**
   * @public
   * @function
   * @api stable
   */
  deactivate() {}

  /**
   * @memberof WMCControl
   */
  getViewContext() {
    const viewContext = {
      General: {
        BoundingBox: {},
      },
      LayerList: {
        Layer: [],
      },
      $version: '1.1.0',
      $xmlns: 'http://www.opengis.net/context',
      $id: 'Contexto_IECA',
      '$xmlns:xlink': 'http://www.w3.org/1999/xlink',
      '$xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '$xsi:schemaLocation': 'http://www.opengis.net/context http://schemas.opengis.net/context/1.1.0/context.xsd',
    };

    viewContext.General.Title = 'WMC IECA';

    // vista del mapa
    // mapView.getZoom
    viewContext.General.BoundingBox.$SRS = this.facadeMap_.getProjection().code;
    const extent = this.facadeMap_.getBbox();
    viewContext.General.BoundingBox.$minx = extent.x.min;
    viewContext.General.BoundingBox.$miny = extent.y.min;
    viewContext.General.BoundingBox.$maxx = extent.x.max;
    viewContext.General.BoundingBox.$maxy = extent.y.max;
    viewContext.General.KeywordList = {
      Keyword: ['IECA'],
    };
    viewContext.General.Abstract = 'Fichero de configuración del contexto de visualización de capas.';
    viewContext.General.Extension = {};
    const maxExtent = this.facadeMap_.getMaxExtent();
    if (maxExtent) {
      viewContext.General.Extension['ol:maxExtent'] = {
        '$xmlns:ol': 'http://openlayers.org/context',
        $minx: maxExtent.x ?
          maxExtent.x.min : maxExtent[0],
        $miny: maxExtent.y ?
          maxExtent.x.min : maxExtent[1],
        $maxx: maxExtent.x ?
          maxExtent.x.min : maxExtent[2],
        $maxy: maxExtent.y ?
          maxExtent.x.min : maxExtent[3],
      };
    }
    // ancho en pixels del mapa
    /* viewContext.General.Window.$width = vsMap.getSize()[0];
    viewContext.General.Window.$height = vsMap.getSize()[1]; */

    // CAPAS
    /* eslint-disable */
    for (const layer of this.facadeMap_.getWMS()) {
      const wmcLayer = {};

      wmcLayer.$hidden = !layer.isVisible() ?
        1 :
        0;
      wmcLayer.$queryable = layer.isQueryable() ?
        1 :
        0;
      wmcLayer.Name = layer.name;
      wmcLayer.Title = layer.legend;
      // server
      wmcLayer.Server = {
        OnlineResource: {
          '$xmlns:xlink': 'http://www.w3.org/1999/xlink',
          '$xlink:type': 'simple',
          '$xlink:href': layer.url,
        },
        $service: 'OGC:WMS',
        $version: layer.version,
      };

      // Si se trata de una capa base, incluyo la leyenda porque debería ser la imagen del mapa
      if (!layer.transparent) {
        wmcLayer.StyleList = {
          Style: [
            {
              $current: 1,
              Name: 'Default',
              Title: 'Default',
              LegendURL: {
                $width: 200,
                $height: 120,
                $format: 'image/png',
                OnlineResource: {
                  '$xmlns:xlink': 'http://www.w3.org/1999/xlink',
                  '$xlink:type': 'simple',
                  '$xlink:href': layer.getLegendURL(),
                },
              },
            },
          ],
        };
      }

      // EXTENSIONES DE MAPEA
      wmcLayer.Extension = {
        'ol:opacity': {
          '#text': layer.getOpacity(),
          '$xmlns:ol': 'http://openlayers.org/context',
        },
        'ol:transparent': {
          '#text': layer.transparent,
          '$xmlns:ol': 'http://openlayers.org/context',
        },
        'ol:isBaseLayer': {
          '#text': !layer.transparent,
          '$xmlns:ol': 'http://openlayers.org/context',
        },
        'ol:displayInLayerSwitcher': {
          '#text': layer.displayInLayerSwitcher,
          '$xmlns:ol': 'http://openlayers.org/context',
        },
        'ol:singleTile': {
          '#text': layer.tiled,
          '$xmlns:ol': 'http://openlayers.org/context',
        },
      };

      viewContext.LayerList.Layer.push(wmcLayer);
    }
    /* eslint-enable */
    return viewContext;
  }
}
