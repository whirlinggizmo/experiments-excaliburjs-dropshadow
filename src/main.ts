import { Color, Engine, vec, DisplayMode, EngineOptions, BoundingBox } from "excalibur";
import { Resources, loader } from "./resources";
import { isMobile } from "./util/platform";
import { random } from "./util/random";
import { DropShadowActor } from "./dropshadow/dropshadowactor";
import { DropShadowLightHelper } from "./dropshadow/dropshadowlighthelper";
import { zoomCameraToBoundingBox } from "./util/camera";


class Game extends Engine {

  lightSourceDirection = vec(5, 5);
  treeActors: DropShadowActor[] = [];

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


  async initialize() {
    // Create a forest of DropShadowActor trees!
    const numTrees = 50;
    const forestWidth = this.drawWidth;
    const forestHeight = this.drawHeight;

    for (let i = 0; i < numTrees; i++) {
      let actor = new DropShadowActor({
        pos: vec(random.randomInteger(0, forestWidth), random.randomInteger(0, forestHeight)),
        rotation: random.randomNumber() * Math.PI * 2,
        scale: vec(1, 1).scale(random.randomNumber(1, 3)),
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
        lightSourceType: "point",  // "1" for directional, "2" for point
        visualize: false,          // "3" toggles line visualization
        interactive: true,        // "0" toggle interactive
      }
    );
    dropShadowLightHelper.graphics.use(Resources.Sun.toSprite());
    this.add(dropShadowLightHelper);
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
    const padding = Math.max(this.currentScene.camera.viewport.width, this.currentScene.camera.viewport.height) * 0.01;
    // zoom the camera out so our zoom in is more dramatic
    this.currentScene.camera.zoom = 0.1;
    // zoom in to include the tree bounding box
    await zoomCameraToBoundingBox(this.currentScene.camera, treesBoundingBox, padding, 1000);
  }
}

random.reseed("Excalibur Rocks!");
const game = new Game({ suppressPlayButton: true });

// Start the game
(async () => {
  await game.start(loader);
  await game.initialize();
  await game.run();
})();
