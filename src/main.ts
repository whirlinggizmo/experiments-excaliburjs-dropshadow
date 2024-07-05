import { Color, Engine, vec, DisplayMode, EngineOptions, BoundingBox, Actor } from "excalibur";
import { Resources, loader } from "./resources";
import { isMobile } from "./util/platform";
import { randomInteger, randomNumber, setRandomSeed } from "./util/random";
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

  sunDirection = vec(5, 5);
  treeActors: DropShadowActor[] = [];

  initialize() {
    let actorsBoundingBox: BoundingBox = new BoundingBox();

    // Create a forest of DropShadowActor trees!
    const numTrees = 50;
    for (let i = 0; i < numTrees; i++) {
      let actor = new DropShadowActor({
        pos: vec(randomInteger(0, game.screen.drawWidth), randomInteger(0, game.screen.drawHeight)),
        rotation: randomNumber() * Math.PI * 2,
        scale: vec(1, 1).scale(randomNumber(1, 3)),
        width: 64,
        height: 64,
        color: Color.White,
      });
      actor.graphics.use(Resources.TreetopTrimmed.toSprite());
      this.add(actor);
      actor.shadowOffset = this.sunDirection;
      actor.name = `Actor ${i}`;
      this.treeActors.push(actor);

      // debug: set the actor to known pos/scale/rotation
      //actor.scale = vec(5, 5);
      //actor.rotation = Math.PI / 180 * 0; // 45 degrees
      //actor.pos = vec(i * actor.width * 2, 0);
      // end debug: known pos/scale/rotation

      // add the actor to the overall bounding box
      actorsBoundingBox = actorsBoundingBox.combine(actor.graphics.bounds);

    }

    // center the camera on the actors 
    this.currentScene.camera.x = actorsBoundingBox.center.x;
    this.currentScene.camera.y = actorsBoundingBox.center.y;


    const sun = new Actor({
      pos: vec(0, 0),
      width: 32,
      height: 32,
      color: Color.White,
    });
    sun.graphics.use(Resources.Sun.toSprite());
    sun.graphics.anchor = vec(0.5, 0.5);
    this.add(sun);

    // Update the shadow direction every mouse move
    this.input.pointers.primary.on('move', (evt) => {
      // move the sun to the mouse location
      sun.pos = evt.worldPos;

      // loop through the actors and update the shadow direction based on the mouse location
      this.treeActors.forEach(actor => {
        if (actor instanceof DropShadowActor) {
          const direction = vec(evt.worldPos.x - actor.pos.x, evt.worldPos.y - actor.pos.y);
          const normalizedDirection = direction.normalize();
          actor.shadowOffset = normalizedDirection.scale(-8);
        }
      });
    });
  }
}


setRandomSeed("Excalibur Rocks!");
const game = new Game({ suppressPlayButton: true });

game.start(loader).then(() => {
  game.initialize()

});