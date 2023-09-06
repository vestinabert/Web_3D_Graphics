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
    
    return scene;
};
