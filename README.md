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
  - ```javascript
    import * as dat from 'dat.gui'
  - ```javascript
    gui = new dat.GUI()
- Add tweak
  - ```javascript
    gui.add(object, property)
       .min(#) // these attributes are not needed for boolean 
       .max(#)
       .step(#)
       .name('name')
  - add color tweak is different:
    ```javascript
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
    ```javascript
    // add spin to parameters object
    const parameters = {
      spin: () => {
        gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2 })
      }
    }
    gui.add(parameters, 'spin')

## day 7 Textures
- Textures are images that will cover the surface geometry
- Types:
  - color
  - alpha: grayscale image, visibility
  - height: grayscale image, move vertices height
  - normal: light reflection, better performance than height, no need vertices
  - ambient occlusion: grayscale image, fake shadow
  - metalness: grayscale image, metallic
  - roughness: grayscale, roughness
  - etc
- Load Textures:
  - put images inside static folder
    ```javascript
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/textures/door/color.jpg')
    ...
    const material = new THREE.MeshBasicMaterial({ map: texture })
  - track load progress
    ```javascript
    const loadingManager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(loadingManager)
- Repeat, offset, rotation
  ```javascript
  colorTexture.repeat.x = 2
  colorTexture.repeat.y = 2
  colorTexture.wrapS = THREE.MirroredRepeatWrapping
  colorTexture.wrapT = THREE.MirroredRepeatWrapping
  
  colorTexture.offset.x = 0.5
  colorTexture.offset.y = 0.5

  colorTexture.center.x = 0.5
  colorTexture.center.y = 0.5
  colorTexture.rotation = Math.PI * 0.25
- Filter
  - minFilter: when object is far and small
    - THREE.NearestFilter: don't need mipmapping, texture.generateMipmaps = false for performance.
    - THREE.LinearFilter (default)
  - magFilter: when object is close and big
    - THREE.NearestFilter: sharp, better performance
    - THREE.LinearFilter (default): blurry
- .jpg does not support transparency, .png does 
- resources
  - poliigon.com
  - 3dtextures.me
  - arroway-textures.ch

## day 8 Materials
- Material is to put color on each pixel of geometries
- MeshBasicMaterial's properties:
  - material.map = texture
  - material.transparent = true/false (true if use alphaMap)
  - material.color = new THREE.Color(0xffffff)
  - material.alphaMap = texture
  - material.side = THREE.FrontSide/BackSide/DoubleSide
- MeshNormalMaterial:
  - used for light
  - material.flatShading = true/false
- MeshMatcapMaterial:
  - use normals as reference to pick the right color on a texture 
  - material.matcap = matcapTexture
  - resource: github.com/nidorx/matcaps
- MeshDepthMaterial:
  - near = white, far = black
- Material reacts to light
  - new THREE.AmbientLight(color, intensity0-1)
  - new THREE.PointLight(color, intensity0-1)
  - MeshLambertMaterial: performant but lower quality
  - MeshPhongMaterial: less performant but higher quality
  - MeshTongMaterial: cartoon-like
  - MeshStandardMaterial:
    - .metalness = 0-1
    - .roughness = 0-1
    - .aoMap
      - need to set uv2 attribute (identical to uv) to geometry to apply ambient-occlusion map
      - mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2))
      - .aoMapIntensity = 0-10
    - .displacementMap
      - the more subdivisions the more accurate
      - .displacementScale = 0-1
    - .metalnessMap
    - .roughnessMap
    - .normalMap
      - .normalScale.set(0-1, 0-1)
    - .transparent = true
    - .alphaMap
    - Environment map:
      - cube image surrounding the scene
      - const cubeTextureLoader = new THREE.CubeTextureLoader()
        const environmentMapTexture = cubeTextureLoader.load([
        px,nx,py,ny,pz,nz
        ])
        .envMap = environmentMapTexture
      - resource: hdrihaven.com
  - PointsMaterial to create particles

## day 9 3D-Text
- put typeface font under static folder
- FontLoader
  - import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
  - const fontLoader = new THREE.FontLoader()
  - fontLoader.load(
      '/fonts/helvetiker_regular.typeface.json',
      (font) =>
      {
        const textGeometry = new TextGeometry(
          'Hello',
          {
            font: font,
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
          }
        )
        const textMaterial = new THREE.MeshBasicMaterial({wireframe:true})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
      }
    )
  - box bounding to center text
    - textGeometry.computeBoundingBox()
    - move geometry instead of mesh so that rotation on mesh works as expected
    - textGeometry.translate(
        -(textGeometry.boundingBox.max.x-bevelSize)/2,
        -(textGeometry.boundingBox.max.y-bevelSize)/2,
        -(textGeometry.boundingBox.max.z-bevelThickness)/2,
      )
      or textGeometry.center()
- Use same geometry and material for multiple donut meshes 

## day 10 Go live
- add Vercel dependency by npm install vercel
- add new script to package.json
  - "deploy": "vercel --prod"
  - npm run deploy

## day 11 Lights
- AmbientLight
- DirectionalLight: from position to center of scene
- HemisphereLight: sky-ground color
- PointLight: from position to all directions, set decay and distance otherwise strength is uniformed
- RectAreaLight: position and lookAt
- SpotLight: flashlight, set position and add .target to the scene and set target's position
- Baking light into the texture
- Light Helpers: THREE.Directional/Spot/Point/HemisphereLightHelper(light, size)