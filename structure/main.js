const PERSPECTIVE_FOV = 70,
	PERSPECTIVE_NEAR = 1,
	PERSPECTIVE_FAR = 1000,
	CAMERA_POSITION = 400,
	TEXTURE_PATH = "texture.gif",
	BOX_WIDTH = 200,
	BOX_HEIGHT = 200,
	BOX_DEPTH = 200;
let camera = null,
	scene = null,
	renderer = null,
	mesh = null;

window.onload = function () {
	setScene();
	setCamera();
	setRenderer();
	createMesh();
	addToScene();
	render();
};

function setScene() {
	scene = new THREE.Scene();
}

function setCamera() {
	let aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(PERSPECTIVE_FOV, aspectRatio,
		PERSPECTIVE_NEAR, PERSPECTIVE_FAR);
	camera.position.z = CAMERA_POSITION;
}

function createMesh() {
	let texture = new THREE.TextureLoader().load(TEXTURE_PATH),
		material = new THREE.MeshBasicMaterial({ map: texture }),
		geometry = new THREE.BoxBufferGeometry(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH);
	mesh = new THREE.Mesh(geometry, material);
}

function addToScene() {
	scene.add( mesh );
}

function setRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}

function render() {
	requestAnimationFrame(render);
	animate();
	renderer.render(scene, camera);
}

function animate() {
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.0025;
}

