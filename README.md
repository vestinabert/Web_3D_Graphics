# Web_3D_Graphics
## Introduction
I created a web-based 3D graphics application using the Babylon.js framework. The project involves creating a dynamic 3D scene with various elements, including textured shapes, animated objects, a reflective environment with a skybox, and user interaction through mouse input. It also includes the import of external 3D models, a particle system, and the simulation of mirrors.

To experience the project in action, please import the code into Babylon.js Playground at https://playground.babylonjs.com/.
## Features
- **Scene Initialization**.
- **Camera**: An arc rotate camera is created and attached to the canvas for user interaction. This camera allows the user to rotate around the scene.
- **Lights**: A directional light that simulates sunlight and a hemispheric light that provides ambient lighting.
- **Skybox**: A skybox is created using a cube mesh and a cube texture for environmental reflections.
- **Sphere**: A textured sphere is created and positioned in the scene. It has a material with a diffuse texture and transparency settings.
- **Grass Textured Shapes**: A cylindrical shape is created and textured with a grass material. Two additional instances of the cylinder are cloned and positioned at different heights.
- **Shadow Generator**: A shadow generator is used to generate shadows for specific objects in the scene, like the sphere.
- **Sphere Movement**: The sphere's rotation is animated within the onBeforeRenderObservable, creating a dynamic effect.
- **Mesh Import**: An external 3D mesh is loaded into the scene.
- **Particle System**: A particle system is created with a polyhedron mesh.
- **Balloon Mesh**: A balloon-like mesh is created and animated. Its color changes when it intersects with another mesh (cylinder3).
- **Event Handling**: An event handler is set up to display an alert when the balloon mesh is picked up.
- **Glass Planes**: Four glass planes are created, and a reflective material is applied to simulate mirrors. The reflection texture is generated from specific objects in the scene.

## Project preview
<img width="1215" alt="web graphics" src="https://github.com/vestinabert/Web_3D_Graphics/assets/127593981/c42d1484-150b-4812-993b-234f4af0e495">
