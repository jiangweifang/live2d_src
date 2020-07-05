// Created by xiazeyu.

////////////////////////////////////
// Celebrate for the 3.0 version! //
////////////////////////////////////

/**
 * @description The entry point of live2d-widget.
 */


'use strict';
import device from 'current-device';
import { config, configApplyer } from './config/configMgr';
import { EventEmitter } from './utils/EventEmitter';

if (process.env.NODE_ENV === 'development') {
  console.log('--- --- --- --- ---\nLive2Dwidget: Hey that, notice that you are now in DEV MODE.\n--- --- --- --- ---');
}
/**
 * The main entry point, which is ... nothing
 */

class L2Dwidget extends EventEmitter {

  constructor() {
    super();
    this.config = config;
  }

  /**
   * The init function
   * @param {Object}   [userConfig] User's custom config 用户自定义设置
   * @param {String}   [userConfig.model.jsonPath = ''] Path to Live2D model's main json eg. `https://test.com/miku.model.json` model主文件路径
   * @param {Number}   [userConfig.model.scale = 1] Scale between the model and the canvas 模型与canvas的缩放
   * @param {Number}   [userConfig.display.superSample = 2] rate for super sampling rate 超采样等级
   * @param {Number}   [userConfig.display.width = 150] Width to the canvas which shows the model canvas的长度
   * @param {Number}   [userConfig.display.height = 300] Height to the canvas which shows the model canvas的高度
   * @param {String}   [userConfig.display.position = 'left'] Left of right side to show 显示位置：左或右
   * @param {Number}   [userConfig.display.hOffset = 0] Horizontal offset of the canvas canvas水平偏移
   * @param {Number}   [userConfig.display.vOffset = -20] Vertical offset of the canvas canvas垂直偏移
   * @param {Boolean}  [userConfig.mobile.show = true] Whether to show on mobile device 是否在移动设备上显示
   * @param {Number}   [userConfig.mobile.scale = 0.5] Scale on mobile device 移动设备上的缩放
   * @param {String}   [userConfig.name.canvas = 'live2dcanvas'] ID name of the canvas canvas元素的ID
   * @param {String}   [userConfig.name.div = 'live2d-widget'] ID name of the div div元素的ID
   * @param {Number}   [userConfig.react.opacity = 0.7] opacity 透明度
   * @param {Boolean}  [userConfig.dev.border = false] Whether to show border around the canvas 在canvas周围显示边界
   * @return {null}
   */

  init(userConfig = {}) {
    //从这里获取的config
    configApplyer(userConfig);
    this.emit('config', this.config);
    if ((!config.mobile.show) && (device.mobile())) {
      return;
    }
    import(/* webpackMode: 'lazy' */ './lappdelegate').then(f => {
      const callback = () => {
        this.coreApp = f.LAppDelegate;
        if (this.coreApp.getInstance().initialize() == false) {
          return;
        }
        this.coreApp.getInstance().run();
      }
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = 'async';
      script.src = config.js.core;
      document.body.appendChild(script);
      script.onload = function () { callback(); }
      // this.live2DMgr = this.coreApp.theRealInit(this);
    }).catch(err => {
      console.error(err);
    })
  }


  /**
   * Capture current frame to png file {@link captureFrame}
   * @param  {Function} callback The callback function which will receive the current frame
   * @return {null}
   */

  captureFrame(callback) {
    return this.coreApp.captureFrame(callback);
  }

  /**
   * download current frame {@link L2Dwidget.captureFrame}
   * @return {null}
   */

  downloadFrame() {
    this.captureFrame(
      function (e) {
        let link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('type', 'hidden');
        link.href = e;
        link.download = 'live2d.png';
        link.click();
      }
    );
  }

};

let _ = new L2Dwidget();

export {
  _ as L2Dwidget,
}
