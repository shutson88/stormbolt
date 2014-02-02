
var camera, light, renderer, scene, lastTime, skybox, keyboard, player, mouse;

function render(time) {
	requestAnimationFrame(render);

	now = time / 1000;
	if (lastTime == null) { lastTime = now - 1 / 60; }
	delta = now - lastTime;
	lastTime = now;

	if(mouse.pressed("lmb")) {
		pos = mouse.position();
		player.rotation.set(pos.x/100.0, pos.y/100.0, 0);
		//player.position.set(player.position.x + 5, player.position.y, player.position.z);
	}
	if(keyboard.pressed("S")) {
		player.position.set(player.position.x - 5, player.position.y, player.position.z);
	}

	//skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
	renderer.render(scene, camera);
}





    // if ( isMouseDown ) {

    //     theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 )
    //             + onMouseDownTheta;
    //     phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 )
    //           + onMouseDownPhi;

    //     phi = Math.min( 180, Math.max( 0, phi ) );

    //     camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
    //                         * Math.cos( phi * Math.PI / 360 );
    //     camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    //     camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
    //                         * Math.cos( phi * Math.PI / 360 );
    //     camera.updateMatrix();

    // }

    // mouse3D = projector.unprojectVector(
    //     new THREE.Vector3(
    //         ( event.clientX / renderer.domElement.width ) * 2 - 1,
    //         - ( event.clientY / renderer.domElement.height ) * 2 + 1,
    //         0.5
    //     ),
    //     camera
    // );
    // ray.direction = mouse3D.subSelf( camera.position ).normalize();



function setup_skybox() {
	// var textureCube = THREE.ImageUtils.loadTextureCube(urls);
	// textureCube.format = THREE.RGBFormat;
	// var shader = THREE.ShaderLib[ "cube" ];
	// var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
	// uniforms['tCube'].value = textureCube;
	// var skyMaterial = new THREE.ShaderMaterial( { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, depthWrite: false, side: THREE.DoubleSide} );
	//var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xCC0000, specular: 0xff0000, shininess: 10, side: THREE.DoubleSide });


	var urlPrefix = "assets/skybox/";
	var urls = [urlPrefix + "posx.png", urlPrefix + "negx.png", urlPrefix + "posy.png", urlPrefix + "negy.png", urlPrefix + "posz.png", urlPrefix + "negz.png"];

	var materialArray = [];
	for(var i = 0; i < 6; i++) {
		materialArray.push( new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture( urls[i] ), depthWrite: false, side: THREE.BackSide}) );
	}
	var skyMaterial = new THREE.MeshFaceMaterial(materialArray);

	var skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	skybox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skybox);
}

function start() {
	scene = new THREE.Scene();

	canvas = document.getElementById('game-canvas');
	renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true, canvas: canvas});

	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 100000);
	scene.add(camera);
	camera.position.set(0, 5000, 0);
	camera.lookAt(scene.position);

	controls = new THREE.OrbitControls(camera, canvas);

	light = new THREE.PointLight(0xffffff);
	light.position.set(0, 250, 100);
	light.distance = 10000;
	scene.add(light);

	ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);

	keyboard = new THREEx.KeyboardState();
	mouse = new THREEx.MouseState();

	requestAnimationFrame(render);

	var radius = 100, segments = 160;
	var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xCC0000, specular: 0xff0000, shininess: 10 });
	test = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), sphereMaterial);
	test.position.set(0, 900, 0);
	scene.add(test)

	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load("assets/spaceship.js", addModelToScene);

	setup_skybox();
}

function addModelToScene(geometry, materials)
{
	//var material = new THREE.MeshFaceMaterial(materials);
	var material = new THREE.MeshPhongMaterial({ color: 0xCC0000, specular: 0xff0000, shininess: 10, side: THREE.DoubleSide });
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	player = new THREE.Mesh(geometry, material);
	player.scale.set(10,10,10);
	player.position.set(0, -1000, 0);
	player.rotation.set(100, 0, 0);
	scene.add(player);
}
