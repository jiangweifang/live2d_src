/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 * 
 * 由官方文档进行合并LAppDefine.js 与此ts进行合并
 */

import { LogLevel } from './Framework/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */
// 画面
export const ViewMaxScale = 2;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = 'Idle'; // アイドリング
export const MotionGroupTapBody = 'tap_body'; // 体をタップしたとき
export const MotionGroupSleepy = "sleepy";
export const MotionGroupFlickHead = 'flick_head';

export const MotionGroupPinchIn = "pinch_in";
export const MotionGroupPinchOut = "pinch_out";
export const MotionGroupShake = "shake"; 


// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';




// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PrioritySleepy = 2;
export const PriorityNormal = 3;
export const PriorityForce = 4

// デバッグ用ログの表示オプション
export const DebugLogEnable = false;
export const DebugTouchLogEnable = false;
export const DebugDrawHitArea = false;
export const DebugDrawAlphaModel = false;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;


var context = undefined;

var _HitAreasCustomHead_x ='';
var _HitAreasCustomHead_y ='';
var _HitAreasCustomBody_x ='';
var _HitAreasCustomBody_y ='';

export function setContext(webglContext) {
  context = webglContext;
}

export function getContext() {
  return context;
}

export function setHitAreasCustomHead_x(HitAreasCustomHead_x) {
    _HitAreasCustomHead_x = HitAreasCustomHead_x;
  }
  
  export function getHitAreasCustomHead_x() {
    return _HitAreasCustomHead_x;
  }
  
  export function setHitAreasCustomHead_y(HitAreasCustomHead_y) {
    _HitAreasCustomHead_y = HitAreasCustomHead_y;
  }
  
  export function getHitAreasCustomHead_y() {
    return _HitAreasCustomHead_y;
  }

  export function setHitAreasCustomBody_x(HitAreasCustomBody_x) {
    _HitAreasCustomBody_x = HitAreasCustomBody_x;
  }
  
  export function getHitAreasCustomBody_x() {
    return _HitAreasCustomBody_x;
  }
  
  export function setHitAreasCustomBody_y(HitAreasCustomBody_y) {
    _HitAreasCustomBody_y = HitAreasCustomBody_y;
  }
  
  export function getHitAreasCustomBody_y() {
    return _HitAreasCustomBody_y;
  }