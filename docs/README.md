# WMC Session

[![Build Tool](https://img.shields.io/badge/build-Webpack-green.svg)](https://github.com/sigcorporativo-ja/Mapea4-dev-webpack)  

## Descripción

 Plugin de [Mapea](https://github.com/sigcorporativo-ja/Mapea4) desarrollado por el [Instituto de Estadística y Cartografía](https://www.juntadeandalucia.es/institutodeestadisticaycartografia) para poder guardar la sesión de trabajo mediante un fichero de contexto de mapa (WMC), permitiendo poder recuperar, o compartir, dicha sesión en cualquier momento.
 
 ![Imagen](./images/wmc1.PNG)
 
 
## Recursos y uso

- js: wmc.ol.min.js
- css: wmc.min.css

```javascript
let sp = new M.plugin.WMC();
myMap.addPlugin(sp);
```  


