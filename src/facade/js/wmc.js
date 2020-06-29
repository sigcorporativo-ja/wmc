/**
 * @module M/plugin/Wmc
 */
import 'assets/css/wmc';
import WmcControl from './wmccontrol';
import api from '../../api';


export default class Wmc extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(parameters = {}) {
    super(parameters);
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.control_ = null;

    /**
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.params_ = {};
    if (!M.utils.isNullOrEmpty(parameters.params)) {
      this.params_ = parameters.params;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.options_ = {};
    if (!M.utils.isNullOrEmpty(parameters.options)) {
      this.options_ = parameters.options;
    }

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map_ = map;

    this.control_ = new WmcControl();
    this.panel_ = new M.ui.Panel('panelWmc', {
      collapsible: true,
      className: 'm-wmc',
      collapsedButtonClass: 'g-cartografia-opciones',
      position: M.ui.position.TR,
      tooltip: 'Gestión de WMC',
    });
    this.panel_.on(M.evt.ADDED_TO_MAP, (html) => {
      M.utils.enableTouchScroll(html);
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);

    this.control_.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });
  }

  /**
   * @memberof WMC
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_, this.options_] = [null, null, null, null];
  }

  /**
   * @param {any} plugin
   * @returns
   * @memberof WMC
   */
  equals(plugin) {
    let result = false;
    if (plugin instanceof Wmc) {
      result = true;
    }
    return result;
  }

  /**
   * Name to identify this plugin
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  get name() {
    return 'wmc';
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }
}
