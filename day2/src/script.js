import './style.css'
import * as THREE from 'three'
import gasp from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Time
const clock = new THREE.Clock()
// Animations
const tick = () =>
{

    // Update objects
    // camera.rotation.x=clock.getElapsedTime()*2*Math.PI
    camera.position.y=Math.sin(clock.getElapsedTime())
    camera.position.x=Math.cos(clock.getElapsedTime())
    camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}
tick()

