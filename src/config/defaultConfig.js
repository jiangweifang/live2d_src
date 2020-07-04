/**
 * @description The storage of configs. Intend to unify serverJs and clientJs's config
 */

/**
 * Default settings for defaulter
 * @type {Object}
 */

const defaultConfig = {
  js: {
    core: 'src/Core/live2dcubismcore.js'   
  },
  model: {
    jsonPath: './model/biaoqiang/biaoqiang.model3.json',
    scale: 1,
  },
  display: {
    superSample: 2,
    width: 200,
    height: 400,
    position: 'right',
    hOffset: 0,
    vOffset: -20,
  },
  mobile: {
    show: true,
    scale: 0.8,
    motion: true,
  },
  name: {
    canvas: 'live2dcanvas',
    div: 'live2d-widget',
  },
  react: {
    opacity: 0.7,
  },
  dev: {
    border: false
  },
  dialog: {
    enable: false,
    script: null
  }
}

module.exports = defaultConfig;
