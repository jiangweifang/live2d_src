import { Live2DFramework } from "./lib/Live2DFramework"
import PlatformManager from "./PlatformManager"
import LAppModel from "./LAppModel_v2"
import * as LAppDefine from "./lappdefine"

export default function LAppLive2DManager() {
  // console.log("--> LAppLive2DManager()");


  this.models = [];


  this.count = -1;
  this.reloadFlg = false;

  Live2D.init();
  Live2DFramework.setPlatformManager(new PlatformManager);

}

LAppLive2DManager.prototype.createModel = function () {


  var model = new LAppModel();
  this.models.push(model);

  return model;
}


LAppLive2DManager.prototype.changeModel = function (gl, modelurl) {
  // console.log("--> LAppLive2DManager.update(gl)");

  if (this.reloadFlg) {

    this.reloadFlg = false;

    var thisRef = this;
    this.releaseModel(0, gl);
    this.createModel();
    this.models[0].load(gl, modelurl);
  }
};


LAppLive2DManager.prototype.getModel = function (no) {
  // console.log("--> LAppLive2DManager.getModel(" + no + ")");

  if (no >= this.models.length) return null;

  return this.models[no];
};



LAppLive2DManager.prototype.releaseModel = function (no, gl) {
  // console.log("--> LAppLive2DManager.releaseModel(" + no + ")");

  if (this.models.length <= no) return;

  this.models[no].release(gl);

  delete this.models[no];
  this.models.splice(no, 1);
};



LAppLive2DManager.prototype.numModels = function () {
  return this.models.length;
};



LAppLive2DManager.prototype.setDrag = function (x, y) {
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].setDrag(x, y);
  }
}



LAppLive2DManager.prototype.maxScaleEvent = function () {
  if (LAppDefine.DebugLogEnable)
    console.log("Max scale event.");
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].startRandomMotion(LAppDefine.MotionGroupPinchIn,
      LAppDefine.PriorityNormal);
  }
}



LAppLive2DManager.prototype.minScaleEvent = function () {
  if (LAppDefine.DebugLogEnable)
    console.log("Min scale event.");
  for (var i = 0; i < this.models.length; i++) {
    this.models[i].startRandomMotion(LAppDefine.MotionGroupPinchOut,
      LAppDefine.PriorityNormal);
  }
}



LAppLive2DManager.prototype.tapEvent = function (x, y) {
  if (LAppDefine.DebugLogEnable)
    console.log("tapEvent view x:" + x + " y:" + y);

  for (var i = 0; i < this.models.length; i++) {

    if (this.models[i].hitTest(LAppDefine.HitAreaNameHead, x, y)) {

      if (LAppDefine.DebugLogEnable)
        console.log("Tap face.");

      this.models[i].setRandomExpression();
    }else if (this.models[i].hitTest(LAppDefine.HitAreaNameBody, x, y)) {

      if (LAppDefine.DebugLogEnable)
        console.log("Tap body." + " models[" + i + "]");

      this.models[i].startRandomMotion(LAppDefine.MotionGroupTapBody,
        LAppDefine.PriorityNormal);
    }else if (this.models[i].hitTestCustom('head', x, y)) {

      if (LAppDefine.DebugLogEnable)
        console.log("Tap face.");

        this.models[i].startRandomMotion(LAppDefine.MotionGroupFlickHead,
          LAppDefine.PriorityNormal);
    }else if (this.models[i].hitTestCustom('body', x, y)) {

      if (LAppDefine.DebugLogEnable)
        console.log("Tap body." + " models[" + i + "]");

        this.models[i].startRandomMotion(LAppDefine.MotionGroupTapBody,
          LAppDefine.PriorityNormal);
    }
  }

  return true;
};