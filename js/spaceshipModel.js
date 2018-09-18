// Jesús Horacio Rojas Cortés A01020026

var renderer = null,
scene = null,
camera = null,
root = null,
spaceship = null,space=null,
group = null,
orbitControls = null,
loopAnimation = true;

var objLoader = null, objLoader = null;

var duration = 10; // s
var currentTime = Date.now();

function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/Spaceship/Ship.obj',function(object){
            var texture = new THREE.TextureLoader().load('models/Spaceship/Textures/sh3.jpg');
            var normalMap = new THREE.TextureLoader().load('models/Spaceship/Textures/sh3_s.jpg');
            var specularMap = new THREE.TextureLoader().load('models/Spaceship/Textures/sh3_s.jpg');
            object.traverse( function ( child )
            {
                if ( child instanceof THREE.Mesh )
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                    child.material.specularMap = specularMap;
                }
            } );

            spaceship = object;
            spaceship.scale.set(6,6,6);
            spaceship.position.set(7*Math.cos(0*2*Math.PI/7),-3,7*Math.sin(0*2*Math.PI/7));
            root.add(spaceship);
            playAnimations();
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        });
}

function playAnimations()
{
  var key = [];
  var keyCont = 0;
  var verts = [];
  for (var i = 0; i <=7; i++){
    verts.push({
      x: 7*Math.cos(i*2*Math.PI/7),
      y: -3,
      z: 7*Math.sin(i*2*Math.PI/7)}
    );
    keyCont += (1/8);
    key.push(keyCont);
  }
  spaceshipAnimator = new KF.KeyFrameAnimator;
  spaceshipAnimator.init({
      interps:
          [
              {
                  keys:key,
                  values:verts,
                  target:spaceship.position
              },
              {
                keys:key,
  				    	values:[
  				    	        { y : 0 },
                        {y: -Math.PI/3 },
                        {y: -2*Math.PI/3 },
                        { y : -Math.PI  },
                        {y: -10*Math.PI/8 },
                        {y: -12*Math.PI/8 },
                        {y: -14*Math.PI/8 },
  				    	        { y : -Math.PI * 2 }
  				    	        ],
                  target: spaceship.rotation
              }
          ],
      loop: true,
      duration:duration * 500,
      easing:TWEEN.Easing.Sinusoidal.InOut
  });
  spaceshipAnimator.start();
}





function run() {
    requestAnimationFrame(function() { run(); });

        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        //animate();
        KF.update();

        // Update the camera controller
        orbitControls.update();
}


var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 5000 );
    camera.position.set(-5, 6, 45);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(.5, 0, 3);
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);

    // Create the objects
    loadObj();
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );

}
