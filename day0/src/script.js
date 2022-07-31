import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()

//red cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 0xffffff})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Sizes
const sizes = {
    witdth: 800,
    height: 600
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.witdth / sizes.height)
camera.position.z = 1.5
scene.add(camera)

//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.witdth, sizes.height)

renderer.render(scene, camera)
