import namespace from 'mapea-util/decorator';
import WMCImplControl from 'impl/wmcControl';
import WMCLayer from './wmcLayer.js';
import * as xmlbuilder from 'xmlbuilder';

@namespace("M.control")
export class WMCControl extends M.Control {

  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor () {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(M.impl.control.WMCControl)) {
      M.exception('La implementación usada no puede crear controles WMCControl');
    }
    // 2. implementation of this control
    let impl = new M.impl.control.WMCControl();
    super(impl, "WMC");

    this.file_ = null;
    this.inputUrl_ = null;
    this.loadBtn_ = null;
    this.saveBtn_ = null;

    // Inputs tabs
    this.inputsTabs_ = null;
    this.selectedTab_ = '';
    // Inputs nombre carga wmc
    this.inputWMCLoadName_ = null;
    // Inputs nombre guardado wmc
    this.inputWMCSaveName_ = null;
    this.facadeMap_ = null;

  }

  /**
   *
   *
   * @param {any} html
   * @memberof WMCControl
   */
  addEvents(html) {
    let inputFile = html.querySelector('.form div.file > input');
    this.loadBtn_ = html.querySelector('.button > button.load');
    this.saveBtn_ = html.querySelector('.button > button.save');
    this.inputUrl_ = html.querySelector('.form div.url > input');
    this.inputsTabs_ = html.querySelectorAll('input[name="tabs-wmc"]');
    this.selectedTab_ = html.querySelector('input[name="tabs-wmc"]:checked').dataset.tab;
    this.inputWMCLoadName_ = html.querySelector('.form div.load-name > input');
    this.inputWMCSaveName_ = html.querySelector('.form div.save-name > input');

    inputFile.addEventListener('change', (evt) => this.changeFile(evt, inputFile.files[0]));
    this.loadBtn_.addEventListener('click', (evt) => this.loadWMC());
    this.saveBtn_.addEventListener('click', (evt) => this.saveWMC());
    this.inputUrl_.addEventListener('input', (evt) => this.checkButtons());
    this.inputWMCLoadName_.addEventListener('input', (evt) => this.checkButtons());
    this.inputWMCSaveName_.addEventListener('input', (evt) => this.checkButtons());

    // Annado el evento a cada radio button para saber cuando se ha cambiado de tab
    this.inputsTabs_.forEach((element) => {
      element.addEventListener('change', (evt) => this.changeTab(evt));
    });
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    return new Promise((success, fail) => {
      M.template.compile('wmc.html', {}).then((html) => {
        //Establecer eventos
        this.addEvents(html);
        success(html);
      });
    });
  }

  /**
   *
   * Obtiene elemento del DOM escapando caracteres (no validos para busqueda por CSS)
   * @param {any} target
   * @param {any} selector
   * @returns
   * @memberof WMCControl
   */
  getQuerySelectorScapeCSS(target, selector) {
    return target.querySelector(CSS.escape(selector));
  }

  changeTab(evt) {
    evt = (evt || window.event);
    let itemTarget = evt.target;
    this.selectedTab_ = itemTarget.dataset.tab;
    this.checkButtons();
  }

  checkButtons() {
    if (this.selectedTab_ == 'loadWMC') {
      this.loadBtn_.disabled = (M.utils.isNullOrEmpty(this.file_) && M.utils.isNullOrEmpty(this.inputUrl_.value)) ||
        M.utils.isNullOrEmpty(this.inputWMCLoadName_.value);
      this.inputUrl_.disabled = !M.utils.isNullOrEmpty(this.file_);
    } else {
      this.saveBtn_.disabled = M.utils.isNullOrEmpty(this.inputWMCSaveName_.value);
    }
  }

  /**
   *
   *
   * @param {any} file
   * @memberof WMCControl
   */
  changeFile(evt, file) {
    evt = (evt || window.event);
    this.file_ = file;
    this.inputWMCLoadName_.value = this.file_.name.replace(/\.[^/.]+$/, '');
    this.checkButtons();
    if (!M.utils.isNullOrEmpty(file)) {
      if (file.size > 20971520) {
        M.dialog.info('El fichero seleccionado sobrepasa el máximo de 20 MB permitido');
        this.file_ = null;
        this.checkButtons();
      }
    }
  }

  /**
   *
   *
   * @param {any} evt
   * @memberof WMCControl
   */
  changeName(evt) {
    evt = (evt || window.event);
    let itemTarget = evt.target;
    this.loadBtn_.disabled = (itemTarget.value.trim() == '') ? true : false;
  }

  saveWMC() {
    try {
      if ('Blob' in window) {
        let fileName = this.inputWMCSaveName_.value + '.xml';
        const ViewContext = this.getImpl().getViewContext();
        // let  writer = xmlbuilder.streamWriter(process.stdout);
        const xml = xmlbuilder.create({ ViewContext }, { stringify: { convertAttKey: "$" }, encoding: "utf-8" });
        const content = xml.end();
        let textFileAsBlob = new Blob([content], {
          type: "text/plain;charset=utf-8"
        });
        if ('msSaveOrOpenBlob' in navigator) {
          navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
        } else {
          var downloadLink = document.createElement('a');
          downloadLink.download = fileName;
          downloadLink.innerHTML = 'Download File';
          if ('webkitURL' in window) {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
          } else {
            // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = this.destroyClickedElement;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
          }

          downloadLink.click();

        }
      } else {
        M.dialog.info('Tu navegador no soporta la descarga de ficheros Blob HML5');
      }
    } catch (error) {
      console.log(error);
      M.dialog.error('Error al guardar el contexto del mapa');
    }
  }

  /**
   *
   *
   * @memberof WMCControl
   */
  loadWMC() {
    let options;
    if (this.file_) {
      let fileReader = new FileReader();
      fileReader.addEventListener('load', (e) => {
        let documentXML;
        if ((typeof DOMParser !== 'undefined')) {
          documentXML = (new DOMParser()).parseFromString(fileReader.result, 'text/xml');
        }
        options = { documentXML };
        this.addToMap(options);
      });

      fileReader.readAsText(this.file_);
    } else {
      options = { url: this.inputUrl_.value };
      this.addToMap(options);
    }
  }

  addToMap(options) {
    try {
      const wmcLayer = new M.layer.WMCLayer(options);// adds the WMC layer
      wmcLayer.name = this.inputWMCLoadName_.value;
      wmcLayer.url = options.url;
      // Compruebo que no esté ya añadida al mapa
      const wmc = this.facadeMap_.getWMC(wmcLayer);
      if (wmc.length == 0) {
        this.facadeMap_.getImpl().addWMC([wmcLayer]);
        this.facadeMap_.fire(M.evt.ADDED_LAYER, [wmcLayer]);
        this.facadeMap_.fire(M.evt.ADDED_WMC, [wmcLayer]);

        wmcLayer.getImpl().loadContext(options.documentXML).then((context) => {
          wmcLayer.getImpl().loadContextParameters(context);
          /* checks if it should create the WMC control
           to select WMC */
          const wmcselectorActive = (this.facadeMap_.getControls('wmcselector').length > 0);
          const addedWmcLayers = this.facadeMap_.getWMC();
          if (addedWmcLayers.length > 1 && !wmcselectorActive) {
            this.facadeMap_.addControls(new M.control.WMCSelector());
          }
          wmcLayer.select();
        });
      } else {
        wmc[0].select();
      }


    } catch (error) {
      console.log(error);
      M.dialog.error('Error al cargar el fichero. Compruebe que se trata del fichero correcto');
    }
  }

  destroyClickedElement_(event) {
    document.body.removeChild(event.target);
  }



}

