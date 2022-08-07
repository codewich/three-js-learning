# three-js-learning
This repo is for self-learning three.js.

## day 0
Basic three.js scene: scene, mesh, camera, renderer.
Webpack

## day 1 Transform objects:
- Position: .position.x/y/z, distanceTo(Vector3), .normalize(), .position.set(x, y, z), AxesHelper
- Scale: .scale.x/y/z, .scale.set(x, y, z)
- Rotation: .rotation.x/y/x, .rotation.set(x, y, z), Math.PI is half rotation, rotation.reorder('YXZ'), lookAt(Vector3)
- Grouping: new THREE.Group()

## day 2 Animation:
- adapt to the frame rate to make sure the animation has consistent speed (use time diff)
- use built-in clock = new THREE.Clock(), clock.getElapsedTime()

## day 3 Camera:
- Perspective camera: new THREE.PerspectiveCamera(FOV, scene ratio, nearest, farthest)
- Orthographic camera: new THREE.OrthographicCamera(left, right, top, bottom)
- Control: 
  - mousemove event: e.clientX/Y
  - DeviceOrientationControls (not work on IOS)
  - Fly Control
  - First Person Control
  - Pointer Lock Control
  - Orbit Control: three/examples/jsm/controls/OrbitControls, new OrbitControls(camera, dom object), damping needs update in each frame
  - Trackball Control

## day 4 Fullscreen and resizing:
- fullscreen:
  - size = window.innerWidth/Height
  - remove margin and padding
  - fix position 0
  - outline: none
  - overflow: hidden
  - go fullscreen
  ```javascript
    window.addEventListener('dblclick', () =>{
      const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement
      if (!fullScreenElement){
        if (canvas.requestFullscreen()){
          canvas.requestFullscreen()
        }else if (canvas.webkitRequestFullscreen){
          canvas.webkitRequestFullscreen()
        }
      }else{
        if (document.exitFullscreen()){
          document.exitFullscreen()
        }else if (document.webkitExitFullscreen){
          document.webkitExitFullscreen()
        }
      }
    })
- resizing:
  - listen to resize event window.addEventListener('resize', ()=>{})
  - update size
  - update camera aspect and call camera.updateProjectionMatrix()
  - update renderer: renderer.setSize(sizes.width, sizes.height)
- resolve stair effect:
  - renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

## day 5 Geometry
- BoxGeometry:
  - width, height, depth, widthSegments, heightSegments, depthSegments
- BufferGeometry:
  - geometry = new THREE.BufferGeometry().
  - positionArray = new Float32Array(length or [x_1,y_1,z_1,...])
  - positionsAttribute = new THREE.BufferAttribute(positionArray, # of value/vertex)
  - geometry.setAttribute('position', positionsAttribute)

## day 6 Debug UI
- import dat.gui
  - ```
    import * as dat from 'dat.gui'
  - ```
    gui = new dat.GUI()
- Add tweak
  - ```
    gui.add(object, property)
       .min(#) // these attributes are not needed for boolean 
       .max(#)
       .step(#)
       .name('name')
  - add color tweak is different:
    ```
    // create an object for color value because material.color is THREE.Color class
    const parameters = {
      color: 0xff0000
    }
    // change material's color to the attribute
    const material = new THREE.MeshBasicMaterial({ color: parameters.color })
    // add tweak for parameters object with onChange listener
    gui.addColor(parameters, 'color').onChange(
      () => {
        material.color.set(parameters.color)
      }
    )
  - add function:
    ```
    // add spin to parameters object
    const parameters = {
      spin: () => {
        gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2 })
      }
    }
    gui.add(parameters, 'spin')