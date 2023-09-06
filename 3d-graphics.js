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

    return scene;
};
