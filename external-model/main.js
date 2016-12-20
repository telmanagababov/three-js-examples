let MODEL_PATH = "model.js",
	CONTAINER_ID = "container",
	ANIMATION_SPEED = 0.6,
	FLOOR_Y = -250;

let container,
	camera,
	scene,
	renderer,
	mesh,
	mixer,
	clock = null;

window.onload = function () {
	initValues();
	setScene();
	setCamera();
	setGround();
	setLights();
	setRenderer();
	render();
	loadModel();
};

function initValues() {
	container = document.getElementById(CONTAINER_ID);
	clock = new THREE.Clock();
}

function setScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x99ffff, 2000, 10000);
}

function setCamera() {
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 2400;
	scene.add(camera);
}

function setGround() {
	let ground = null,
		geometry = new THREE.PlaneBufferGeometry(16000, 16000),
		material = new THREE.MeshPhongMaterial({emissive: 0x888888});
	material.color = new THREE.Color(0x964b00);
	ground = new THREE.Mesh(geometry, material);
	ground.position.set(0, FLOOR_Y, 0);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);
}

function setLights() {
	let light = new THREE.DirectionalLight(0xebf3ff, 1.5),
		position = 390;
	light.position.set(0, 140, 500).multiplyScalar(1.1);
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.camera.left = -position;
	light.shadow.camera.right = position;
	light.shadow.camera.top = position * 1.5;
	light.shadow.camera.bottom = -position;
	light.shadow.camera.far = 3500;
	scene.add(light);
	scene.add(new THREE.HemisphereLight(0x111111, 0x444444));
}

function setRenderer() {
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = "relative";
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);
}

function loadModel() {
	let loader = new THREE.JSONLoader();
	loader.load(MODEL_PATH, function (geometry, materials) {
		setMaterials(materials);
		createMesh(geometry, materials, 0, FLOOR_Y, -300, 60);
		addAnimation(geometry);
	});
}

function setMaterials(materials) {
	for (let i = 0; i < materials.length; i++) {
		let material = materials[i];
		material.skinning = true;
		material.morphTargets = true;
		material.specular.setHSL(0, 0, 0.1);
		material.color.setHSL(0.025, 0.53, 0.51);
	}
}

function createMesh(geometry, materials, x, y, z, s) {
	geometry.computeBoundingBox();
	mesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
	mesh.name = "Knight Mesh";
	mesh.position.set(x, y - geometry.boundingBox.min.y * s, z);
	mesh.scale.set(s, s, s);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
}

function addAnimation(geometry) {
	let bonesClip = geometry.animations[0],
		facesClip = THREE.AnimationClip.CreateFromMorphTargetSequence('facialExpressions', mesh.geometry.morphTargets, 3);
	mixer = new THREE.AnimationMixer(mesh);
	mixer.clipAction(bonesClip).play();
	mixer.clipAction(facesClip).play();
}

function render() {
	requestAnimationFrame(render);
	if (mixer) {
		mixer.update(ANIMATION_SPEED * clock.getDelta());
	}
	renderer.render(scene, camera);
}