import { Color, Engine, vec, DisplayMode, randomIntInRange, EngineOptions, BoundingBox } from "excalibur";
import { Resources, loader } from "./resources";
import { isMobile } from "./util/platform";
import { DropShadowActor } from "./dropshadow/dropshadowactor";


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
  initialize() {

    let actorsBoundingBox: BoundingBox = new BoundingBox();

    // Create a forest of DropShadowActor trees!
    const numTrees = 2;
    for (let i = 0; i < numTrees; i++) {
      let actor = new DropShadowActor({
        pos: vec(Math.random() * game.screen.drawWidth, Math.random() * game.screen.drawHeight),
        rotation: Math.random() * Math.PI * 2,
        scale: vec(1, 1).scale(randomIntInRange(1, 3)),
        width: 64,
        height: 64,
        color: Color.White,
      });
      actor.graphics.use(Resources.TreetopTrimmed.toSprite());
      this.add(actor);

      // debug: set the actor to known pos/scale/rotation
      actor.scale = vec(5, 5);
      //actor.rotation = Math.PI / 180 * 45; // 45 degrees
      actor.pos = vec(i * actor.width, 0);
      // end debug: known pos/scale/rotation

      // add the actor to the overall bounding box
      actorsBoundingBox = actorsBoundingBox.combine(actor.graphics.bounds);

    }

    // center the camera on the actors 
    this.currentScene.camera.x = actorsBoundingBox.center.x;
    this.currentScene.camera.y = actorsBoundingBox.center.y;
    //

  }
}

export const game = new Game({ suppressPlayButton: true });
game.start(loader).then(() => {
  game.initialize()
});