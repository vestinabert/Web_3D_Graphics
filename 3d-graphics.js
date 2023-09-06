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
    
    return scene;
};
