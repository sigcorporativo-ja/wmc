import namespace from 'mapea-util/decorator';
import WMCControl from './wmcControl.js';
import css from 'assets/css/wmc.css';

@namespace("M.plugin")
class WMC extends M.Plugin {


  /**
 * Name to identify this plugin
 * @const
 * @type {string}
 * @public
 * @api stable
 */
  static get NAME() {
    return 'WMC';
  }

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
  constructor (parameters) {

    parameters = (parameters || {});

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
    * * TODO
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

    this.control_ = new M.control.WMCControl();
    this.panel_ = new M.ui.Panel('wmc', {
      'collapsible': true,
      'className': 'm-wmc',
      'collapsedButtonClass': 'g-cartografia-opciones',
      'position': M.ui.position.TR,
      'tooltip': 'Gestión de WMC'
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
   *
   *
   * @memberof WMC
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    this.map_ = null;
    this.control_ = null;
    this.panel_ = null;
    this.options_ = null;
  }

  /**
   *
   *
   * @param {any} plugin
   * @returns
   * @memberof WMC
   */
  equals(plugin) {
    if (plugin instanceof WMC) {
      return true;
    }
    else {
      return false;
    }
  }
}
