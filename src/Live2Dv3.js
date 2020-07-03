import "./lib/Live2Dv3Framework";
import "./lib/Live2Dv3Pixi";
import "./Live2Dv3Model";


window.loadlive2Dv3 = function (basePath) {
    return new Viewer(basePath)
}

class Viewer { // eslint-disable-line no-unused-vars
    constructor ({ basePath, modelName, width = 500, height = 300, el, sizeLimit, mobileLimit, sounds }) {
      if (typeof Live2DCubismCore === 'undefined') {
        console.error('live2dv3 failed to load:\nMissing live2dcubismcore.js\nPlease add "https://cdn.jsdelivr.net/gh/HCLonely/Live2dV3/js/live2dcubismcore.min.js" to the "<script>" tag.\nLook at https://github.com/HCLonely/Live2dV3')
        return
      }
      if (typeof PIXI === 'undefined') {
        console.error('live2dv3 failed to load:\nMissing pixi.js\nPlease add "https://cdn.jsdelivr.net/npm/pixi.js@4.6.1/dist/pixi.min.js" to the "<script>" tag.\nLook at https://github.com/HCLonely/Live2dV3')
        return
      }
      if (!el) {
        console.error('"el" parameter is required')
        return
      }

      if (!this.isDom(el)) {
        if (el.length > 0) {
          if (this.isDom(el[0])) {
            el = el[0]
          } else {
            console.error('live2dv3 failed to load:\n', el[0], 'is not a HTMLElement object')
            return
          }
        } else {
          console.error('live2dv3 failed to load:\n', el, 'is not a HTMLElement object')
          return
        }
      }

      if (sizeLimit && (document.documentElement.clientWidth < width || document.documentElement.clientHeight < height)) return
      if (mobileLimit && /Mobile|Mac OS|Android|iPhone|iPad/i.test(navigator.userAgent)) return

      window.console.log('Live2dV3: loading model "' + modelName + '"')

      this.l2dMod = new Live2DModel(basePath)

      //this.canvas = el

      if (modelName) {
        this.modelName = modelName
        this.l2dMod.load(modelName, this)
      }

      this.app = new PIXI.Application(width, height, { transparent: true })
      el = this.app.view;

      this.app.ticker.add((deltaTime) => {
        if (!this.model) {
          return
        }

        this.model.update(deltaTime)
        this.model.masks.update(this.app.renderer)
      })
      window.onresize = (event) => {
        if (event === undefined) { event = null }
        this.app.view.style.width = width + 'px'
        this.app.view.style.height = height + 'px'
        this.app.renderer.resize(width, height)

        if (this.model) {
          this.model.position = new PIXI.Point((width * 0.5), (height * 0.5))
          this.model.scale = new PIXI.Point((this.model.position.x * 0.06), (this.model.position.x * 0.06))
          this.model.masks.resize(this.app.view.width, this.app.view.height)
        }
      }
      this.isClick = false
      this.app.view.addEventListener('mousedown', (event) => {
        this.isClick = true
      })
      this.app.view.addEventListener('mousemove', (event) => {
        if (this.isClick) {
          this.isClick = false
          if (this.model) {
            this.model.inDrag = true
          }
        }

        if (this.model) {
          const mouseX = this.model.position.x - event.offsetX
          const mouseY = this.model.position.y - event.offsetY
          this.model.pointerX = -mouseX / this.app.view.height
          this.model.pointerY = -mouseY / this.app.view.width
        }
      })
      this.app.view.addEventListener('mouseup', (event) => {
        if (!this.model) {
          return
        }

        if (this.isClick) {
          if (this.isHit('TouchHead', event.offsetX, event.offsetY)) {
            this.startAnimation('touch_head', 'base')
          } else if (this.isHit('TouchSpecial', event.offsetX, event.offsetY)) {
            this.startAnimation('touch_special', 'base')
          } else {
            const bodyMotions = ['touch_body', 'main_1', 'main_2', 'main_3']
            const currentMotion = bodyMotions[Math.floor(Math.random() * bodyMotions.length)]
            this.startAnimation(currentMotion, 'base')
          }
          if (sounds && sounds.length > 0) {
            const soundFile = sounds[Math.floor((Math.random() * sounds.length))]
            const filePath = /^https?:\/\//.test(soundFile) ? soundFile : [basePath, modelName, soundFile].join('/').replace(/(?<!:)\/\//g, '/')
            if (typeof Howl !== 'undefined') {
              new Howl({ src: [filePath] }).play()
            } else if (typeof Audio !== 'undefined') {
              new Audio(filePath).play()
            } else {
              console.error('Current browser does not support playing sound.')
            }
          }
        }

        this.isClick = false
        this.model.inDrag = false
      })
    }

    changeCanvas (model) {
      this.app.stage.removeChildren()

      this.model = model
      this.model.update = this.onUpdate
      this.model.animator.addLayer('base', LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1)

      this.app.stage.addChild(this.model)
      this.app.stage.addChild(this.model.masks)

      window.onresize()
    }

    onUpdate (delta) {
      const deltaTime = 0.016 * delta

      if (!this.animator.isPlaying) {
        const m = this.motions.get('idle')
        this.animator.getLayer('base').play(m)
      }
      this._animator.updateAndEvaluate(deltaTime)

      if (this.inDrag) {
        this.addParameterValueById('ParamAngleX', this.pointerX * 30)
        this.addParameterValueById('ParamAngleY', -this.pointerY * 30)
        this.addParameterValueById('ParamBodyAngleX', this.pointerX * 10)
        this.addParameterValueById('ParamBodyAngleY', -this.pointerY * 10)
        this.addParameterValueById('ParamEyeBallX', this.pointerX)
        this.addParameterValueById('ParamEyeBallY', -this.pointerY)
      }

      if (this._physicsRig) {
        this._physicsRig.updateAndEvaluate(deltaTime)
      }

      this._coreModel.update()

      let sort = false
      for (let m = 0; m < this._meshes.length; ++m) {
        this._meshes[m].alpha = this._coreModel.drawables.opacities[m]
        this._meshes[m].visible = Live2DCubismCore.Utils.hasIsVisibleBit(this._coreModel.drawables.dynamicFlags[m])
        if (Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(this._coreModel.drawables.dynamicFlags[m])) {
          this._meshes[m].vertices = this._coreModel.drawables.vertexPositions[m]
          this._meshes[m].dirtyVertex = true
        }
        if (Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(this._coreModel.drawables.dynamicFlags[m])) {
          sort = true
        }
      }

      if (sort) {
        this.children.sort((a, b) => {
          const aIndex = this._meshes.indexOf(a)
          const bIndex = this._meshes.indexOf(b)
          const aRenderOrder = this._coreModel.drawables.renderOrders[aIndex]
          const bRenderOrder = this._coreModel.drawables.renderOrders[bIndex]

          return aRenderOrder - bRenderOrder
        })
      }

      this._coreModel.drawables.resetDynamicFlags()
    }

    startAnimation (motionId, layerId) {
      if (!this.model) {
        return
      }

      const m = this.model.motions.get(motionId)
      if (!m) {
        return
      }

      const l = this.model.animator.getLayer(layerId)
      if (!l) {
        return
      }

      l.play(m)
    }

    isHit (id, posX, posY) {
      if (!this.model) {
        return false
      }

      const m = this.model.getModelMeshById(id)
      if (!m) {
        return false
      }

      const vertexOffset = 0
      const vertexStep = 2
      const vertices = m.vertices

      let left = vertices[0]
      let right = vertices[0]
      let top = vertices[1]
      let bottom = vertices[1]

      for (let i = 1; i < 4; ++i) {
        const x = vertices[vertexOffset + i * vertexStep]
        const y = vertices[vertexOffset + i * vertexStep + 1]

        if (x < left) {
          left = x
        }
        if (x > right) {
          right = x
        }
        if (y < top) {
          top = y
        }
        if (y > bottom) {
          bottom = y
        }
      }

      const mouseX = m.worldTransform.tx - posX
      const mouseY = m.worldTransform.ty - posY
      const tx = -mouseX / m.worldTransform.a
      const ty = -mouseY / m.worldTransform.d

      return ((left <= tx) && (tx <= right) && (top <= ty) && (ty <= bottom))
    }

    isDom (e) {
      if (typeof HTMLElement === 'object') {
        return e instanceof HTMLElement
      } else {
        return e && typeof e === 'object' && e.nodeType === 1 && typeof e.nodeName === 'string'
      }
    }

    loadModel (modelName) {
      this.l2dMod.load(modelName || this.modelName, this)
    }
  }

function onChangeLog(){
    $(document.body).append($("<div></div>")
        .attr("id","darken")
        .addClass("darken")
        .css("top", window.pageYOffset + "px")
        .click(function(){
            $('#selector').remove();
            $('#darken').remove();
            $(document.body).css("overflow", "auto");
        }))
    .append($("<div></div>")
        .attr("id","selector")
        .addClass("selector")
        .css("top", (window.pageYOffset + (window.innerHeight * 0.05)) + "px")
        .css("padding", "2%"))
    .css("overflow", "hidden");
    $("#selector").append($("<table></table>")
        .addClass("wikitable")
        .append($("<tr></tr>")
            .append($("<td></td>")
                .css("background-color", "#24252D")
                .css("height", "30px")
                .css("padding-left", "8px")
                .html("<b>Changelog</b>")
            )
        )
        .append($("<tr></tr>")
            .append($("<td></td>")
                .attr("id", "chglog")
                .css("padding", "15px")
                .css("vertical-align","text-top")
            )
        )
    )

    var cb = function (response){
        for (i in response){
            var message = response[i].commit.message;
            var date = response[i].commit.committer.date;
            date = date.replace("T", " ");
            date = date.replace("Z", " UTC");

            $("#chglog").append($("<p></p>")
                .css("line-height", "0.8")
                .html(message+"<br>")
                .append($("<font></font>")
                    .css("font-size", "10px")
                    .css("color", "gray")
                    .html(date)
                )
            );
        }
    }

    var xobj = new XMLHttpRequest();
    xobj.open("GET", "https://api.github.com/repos/alg-wiki/AzurLaneL2DViewer/commits?sha=gh-pages", true);
    xobj.setRequestHeader("Authorization", "token c44bb04d2275b3c1849b49f02d8c1b473c5b6864");
    //access token scope: <<no scope>>
    //Grants read-only access to public information (includes public user profile info, public repository info, and gists)
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            cb(JSON.parse(xobj.response));
          }
    };
    xobj.send(null); 
}

function onSelectBG(){
    console.log(window.pageXOffset + " : " + window.pageYOffset);
    var div = document.createElement('div');
    div.className = "darken";
    div.id = "darken";
    div.style.top = window.pageYOffset + "px";
    div.addEventListener("click", function(e) {
            document.body.removeChild(document.getElementById("selector"));
            document.body.removeChild(document.getElementById("darken"));
            document.body.style.overflow = "auto";
        }, false);
    document.body.appendChild(div);
    document.body.style.overflow = "hidden";
    var selector = document.createElement('div');
    selector.id = "selector";
    selector.className = "selector";
    selector.style.top = (window.pageYOffset + (window.innerHeight * 0.05)) + "px" ;
    document.body.appendChild(selector);
    for (var i = 0; i < backgroundData.length; i++){
        var img = document.createElement('div');
        img.className = "thumbbutton";
        img.style.backgroundImage = "url(../assets/bg/"+backgroundData[i]+")";
        img.style.backgroundSize = "100%";
        img.id = backgroundData[i];
        img.addEventListener("click", function(e) {
            document.getElementById("L2dCanvas").style.backgroundImage = "url(../assets/bg/"+this.id+")";
            document.body.removeChild(document.getElementById("selector"));
            document.body.removeChild(document.getElementById("darken"));
            document.body.style.overflow = "auto";
        }, false);
        document.getElementById("selector").appendChild(img);
    }
}

