import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.querySelector('#three').appendChild(renderer.domElement)

const ground_geo = new THREE.BoxGeometry(500, 5, 500)
const ground_mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
const ground_mesh = new THREE.Mesh(ground_geo, ground_mat)
ground_mesh.position.y = -2.5
ground_mesh.position.z = -100
ground_mesh.receiveShadow = true
scene.add(ground_mesh)

const sky_geo = new THREE.SphereGeometry(500)
const sky_mat = new THREE.MeshBasicMaterial({ color: 0x0000ff })
sky_mat.side = THREE.BackSide
const sky_mesh = new THREE.Mesh(sky_geo, sky_mat)
scene.add(sky_mesh)

const loader = new GLTFLoader()
loader.load('models/handie.glb', (glb) => {
    glb.scene.rotation.y = Math.PI * 0.85
    glb.scene.position.y = 0.1
    glb.scene.position.x = 1.5
    glb.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true
        }
    })
    scene.add(glb.scene)
}, undefined, err => console.error(err))

loader.load('models/platform.glb', (glb) => {
    glb.scene.position.y = 0.1
    glb.scene.position.x = 1.5
    glb.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    scene.add(glb.scene)
})

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 1, 1)
directionalLight.castShadow = true
scene.add(directionalLight)

const backLight1 = new THREE.DirectionalLight(0xffffff, 0.25)
backLight1.position.set(5, 10, -10)
backLight1.castShadow = true
const backLight2 = new THREE.DirectionalLight(0xffffff, 0.25)
backLight2.position.set(0, 10, -10)
backLight2.castShadow = true
scene.add(backLight1)
scene.add(backLight2)

camera.position.z = 3
camera.position.y = 1

// const controls = new OrbitControls(camera, renderer.domElement)

const animate = () => {
    requestAnimationFrame(animate)
    // controls.update()
    renderer.render(scene, camera)
}

animate()