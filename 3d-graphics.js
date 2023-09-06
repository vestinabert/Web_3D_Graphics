var createScene = function () {
    // Create a new Babylon.js scene
    var scene = new BABYLON.Scene(engine);

    // Create an arc rotate camera for user interaction
    var camera = new BABYLON.ArcRotateCamera("Camera", 2, Math.PI / 1.8, 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add directional light for sunlight simulation
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0.2, -2, 0.2), scene);
    light.intensity = 0.8;
    light.position = new BABYLON.Vector3(0, 10, 0);

    // Add a hemispheric light for ambient lighting
    var light2 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, -2, 0), scene);

    // Skybox creation and material setup
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Create a sphere
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1.5;
    
    // Material setup for the sphere
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture("textures/cloud.png", scene);
    mat.diffuseTexture.hasAlpha = true;
    mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;
    mat.useAlphaFromDiffuseTexture = true;
    mat.diffuseColor = new BABYLON.Color3(0.47, 0, 0);
    sphere.material = mat;

    // Texture setup for grass material
    var grass = new BABYLON.StandardMaterial("grass", scene);
    grass.ambientTexture = new BABYLON.Texture("textures/grass.png", scene);
    grass.diffuseColor = new BABYLON.Color3(1, 0, 0);

    // Create and position cylinders with grass texture
    var shape = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 0.3, diameter: 4 });
    shape.material = grass;
    shape.receiveShadows = true;

    // Clone cylinders at different positions
    const cylinder2 = shape.clone("cylinder2");
    cylinder2.position.y = -1;
    cylinder2.scaling = new BABYLON.Vector3(0.8, 1, 0.8);
    const cylinder3 = shape.clone("cylinder3");
    cylinder3.position.y = -2;
    cylinder3.scaling = new BABYLON.Vector3(0.6, 1, 0.6);
    cylinder2.receiveShadows = false;
    cylinder3.receiveShadows = false;

    // Shadow generation setup
    var sg = new BABYLON.ShadowGenerator(1024, light);
    sg.usePercentageCloserFiltering = true;
    sg.addShadowCaster(sphere);
    sg.enableSoftTransparentShadow = true;
    sg.transparencyShadow = true;

    // Sphere movement animation
    let k = 0;
    scene.onBeforeRenderObservable.add(() => {
        sphere.rotation.x = Math.cos(k);
        sphere.rotation.y = 2 * Math.sin(k);
        sphere.rotation.z = Math.sin(2 * k);
        k += 0.01;
    });

    // Mesh loading
    BABYLON.SceneLoader.ImportMesh("", Assets.meshes.ufo.rootUrl, Assets.meshes.ufo.filename, scene, function (meshes) {
        meshes[0].position.y = 0.8;
    });

    // Mirrow material setup
    var shapeMaterial = new BABYLON.StandardMaterial("mat", scene);
    shapeMaterial.backFaceCulling = true;
    shapeMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    shapeMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
    shapeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    shapeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

     // Particle system setup
    var particleNb = 1000;
    var poly = new BABYLON.MeshBuilder.CreatePolyhedron('p', {type: 2, size: 1.0}, scene)
    poly.isVisible = false;
    poly.manualUpdateOfWorldMatrixInstancedBuffer = true;
    
    poly.material = shapeMaterial;
    
    var particles = [];                 // instances array
    var logicalParticles = [];          // instance data array
    for (var i = 0; i < particleNb; i++) {
        var particle = poly.createInstance("i" + i);
        particle.isPickable = false;
        particles.push(particle);
        var t = Math.random() * 100.0;
        var factor = 20.0 + Math.random() * 100.0;
        var speed = 0.01 + Math.random() / 800.0;
        var xFactor = -50.0 + Math.random() * 100.0;
        var yFactor = -50.0 + Math.random() * 100.0;
        var zFactor = -50.0 + Math.random() * 100.0;
        var data = {t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0, mat: new BABYLON.Matrix(), quat: new BABYLON.Quaternion()}
        logicalParticles.push(data);
    }

    var updateParticles = function() {
        var offset = 0;
        let instancedBuffer = poly.worldMatrixInstancedBuffer;
        
        if (!instancedBuffer) {
            return;
        }
        logicalParticles.forEach((particle, i) => {
            // logical particle
            let { t, factor, speed, xFactor, yFactor, zFactor, mat, quat } = particle
            t = particle.t += speed / 2
            const a = Math.cos(t) + Math.sin(t * 1) / 10
            const b = Math.sin(t) + Math.cos(t * 2) / 10
            const s = Math.cos(t)
            particle.mx += (mouseX - particle.mx) * 0.01
            particle.my += (mouseY * -1 - particle.my) * 0.01

            // instance
            var p = particles[i];
            var pos = p.position;
            pos.x = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
            pos.y = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
            pos.z = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;
            var scl = p.scaling;
            scl.x = scl.y = scl.z = Math.abs(s);
            var r = s * 5.0;

            BABYLON.Quaternion.RotationYawPitchRollToRef(r, r, r, quat);
            BABYLON.Matrix.ComposeToRef(scl, quat, pos, mat);

            instancedBuffer.set(mat.m, offset);
            offset += 16;
        });
    }

    scene.freezeActiveMeshes(true);

    // Mouse interaction for particle movement
    var mouseX;
    var mouseY;
    scene.registerBeforeRender(function() {
        mouseX = scene.pointerX - window.innerWidth * 0.5;
        mouseY = scene.pointerY - window.innerHeight * 0.5;
        updateParticles();
    })

    // Balloon mesh creation and animation
    var balloon = BABYLON.Mesh.CreateSphere("balloon", 10, 1.0, scene);
    balloon.material = new BABYLON.StandardMaterial("matBallon", scene);
    balloon.position = new BABYLON.Vector3(0, -3, 0);

    var alpha = Math.PI;
    scene.registerBeforeRender(function () {

        if (balloon.intersectsMesh(cylinder3, false)) {
            balloon.material.diffuseColor = new BABYLON.Color3(0.36, 0, 0);
        } else {
            balloon.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        }

        alpha += 0.08;
        balloon.position.y += Math.cos(alpha) / 20;
        
    });

    // Event handling for the balloon mesh
    balloon.actionManager = new BABYLON.ActionManager(scene);
    balloon.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
        alert('trying to connect');
    }));

    // Creation of glass planes with reflective surfaces
    for(var i=0; i<4; i++) {
		var glass = BABYLON.MeshBuilder.CreatePlane("glass", {width: 5, height: 5}, scene);
		glass.position = new BABYLON.Vector3(((i<2) - 0.5)*12*((i%2) == 1), 0, ((i<2) - 0.5)*12*((i%2) == 0));
		glass.rotation = new BABYLON.Vector3(0, i * Math.PI / 2, 0);
	
		//Ensure working with new values for glass by computing and obtaining its worldMatrix
		glass.computeWorldMatrix(true);
		var glass_worldMatrix = glass.getWorldMatrix();
	
		//Obtain normals for plane and assign one of them as the normal
  		var glass_vertexData = glass.getVerticesData("normal");
		var glassNormal = new BABYLON.Vector3(glass_vertexData[0], glass_vertexData[1], glass_vertexData[2]);	
		//Use worldMatrix to transform normal into its current value
		glassNormal = BABYLON.Vector3.TransformNormal(glassNormal, glass_worldMatrix)
	
		//Create reflecting surface for mirror surface
		var reflector = BABYLON.Plane.FromPositionAndNormal(glass.position, glassNormal.scale(-1));

		//Create the mirror material
		var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
		mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
		mirrorMaterial.reflectionTexture.mirrorPlane = reflector;
		mirrorMaterial.reflectionTexture.renderList = [sphere, shape, cylinder2, cylinder3];
		mirrorMaterial.reflectionTexture.level = 1;
	
		glass.material = mirrorMaterial;
	}
    
    return scene;
};
