import { Color, Text, Engine, vec, DisplayMode, EngineOptions, BoundingBox, Actor, Font, Vector } from "excalibur";
import { Resources, loader } from "./resources";
import { isMobile } from "./util/platform";
import { randomInteger, randomNumber, setRandomSeed } from "./util/random";
import { DropShadowActor } from "./dropshadow/dropshadowactor";
import { DropShadowLightHelper } from "./dropshadow/dropshadowlighthelper";
import { zoomCameraToBoundingBox } from "./util/camera";


class Game extends Engine {
  constructor(engineOptions?: EngineOptions) {
    super({
      ...{
        width: isMobile ? 1280 / 4 : 1920,
        height: isMobile ? 2280 / 4 : 1080,
        displayMode: DisplayMode.FitScreen,
        canvasElementId: 'renderCanvas',
      },
      ...engineOptions
    });
  }

  lightSourceDirection = vec(5, 5);
  treeActors: DropShadowActor[] = [];


  async initialize() {
    // Create a forest of DropShadowActor trees!
    const numTrees = 75;
    const aspectRatio = this.currentScene.camera.viewport.height / this.currentScene.camera.viewport.width;
    const forestWidth = 2000;
    const forestHeight = forestWidth * aspectRatio;

    for (let i = 0; i < numTrees; i++) {
      let actor = new DropShadowActor({
        pos: vec(randomInteger(0, forestWidth), randomInteger(0, forestHeight)),
        rotation: randomNumber() * Math.PI * 2,
        scale: vec(1, 1).scale(randomNumber(1, 3)),
        width: 64,
        height: 64,
        color: Color.White,
      });
      actor.graphics.use(Resources.TreetopTrimmed.toSprite());
      this.add(actor);
      actor.name = `Actor ${i}`;
      this.treeActors.push(actor);
    }

    // optionally add a light source helper
    const dropShadowLightHelper = new DropShadowLightHelper(
      {
        lightSourceDirection: this.lightSourceDirection,
        maxShadowLength: 7,
        dropShadowActors: this.treeActors,
        lightSourceType: "directional",  // "1" for directional, "2" for omni
        visualize: true,          // "3" toggles line visualization
        interactive: true,        // "0" toggle interactive
      }
    );
    dropShadowLightHelper.graphics.use(Resources.Sun.toSprite());
    this.add(dropShadowLightHelper);

    // add some text to explain the controls
    const text = new Actor({
      pos: vec(0, 0),
      width: 100,
      height: 100,
      anchor: Vector.Zero
    });
    text.graphics.add(new Text({
      text: `
      [Keyboad Controls]:
      1: Directional Light
      2: Omni Light
      3: Toggle Line Visualization
      0: Toggle Interativity`,
      color: Color.White,
      font: new Font({ size: 20, family: 'Arial' }),
    }));
    this.add(text);

  }

  async run() {
    // Create a bounding box that encompasses all tree actors
    // then zoom the camera to fit the bounding box
    let treesBoundingBox: BoundingBox = new BoundingBox();
    // add the actor to the overall bounding box
    for (const actor of this.treeActors) {
      treesBoundingBox = treesBoundingBox.combine(actor.graphics.bounds);
    }
    // Zoom the camera to fit the bounding box of all tree actors, with padding
    const padding = Math.min(this.currentScene.camera.viewport.width, this.currentScene.camera.viewport.height) * 0.01;
    // zoom the camera out so our zoom in is more dramatic
    this.currentScene.camera.zoom = 0.1;
    // zoom in to include the tree bounding box
    await zoomCameraToBoundingBox(this.currentScene.camera, treesBoundingBox, padding, 1000);
  }

}

setRandomSeed("Excalibur Rocks!");
const game = new Game({ suppressPlayButton: true });

// Start the game
(async () => {
  await game.start(loader);
  await game.initialize();
  await game.run();
})();
