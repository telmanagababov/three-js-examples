let scene = null,
	camera = null,
	renderer = null,
	cube = null;

window.onload = function() {
	setRenderer();
	setScene();
	setCube();
	setCamera();
	render();
};

function setRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}

function setScene() {
	scene = new THREE.Scene();
}

function setCube() {
	let geometry = new THREE.BoxGeometry( 1, 1, 1 ),
		material = new THREE.MeshBasicMaterial( { color: 0x11ccf0 } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
}

function setCamera() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;
}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	rotateCube();
}

function rotateCube() {
	cube.rotation.x += 0.0025;
	cube.rotation.y += 0.005;
}