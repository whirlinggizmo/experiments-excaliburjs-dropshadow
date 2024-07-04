import { Color, Engine, vec, Actor, DisplayMode, randomIntInRange, EngineOptions, Line, toRadians, BoundingBox } from "excalibur";
import { Resources, loader } from "./resources";
import { isMobile } from "./util/platform";
import { DropShadowActor } from "./dropshadowactor";


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
      //actor.rotation = toRadians(0);
      actor.pos = vec(i * actor.width, 0);
      // end debug: known pos/scale/rotation

      /*
      // debug: draw line to visualize rotation direction
      const rotationReference = new Actor({
        anchor: actor.anchor.clone(),
        pos: actor.pos.clone(),
        scale: actor.scale.clone(),
        width: actor.graphics.localBounds.width,
        height: actor.graphics.localBounds.height,
        color: Color.Green // box if we don't add the graphic line
      });

      const startingPos = vec(
        actor.center.x,
        actor.center.y
      );

      const endingPos = vec(
        startingPos.x + 32,
        startingPos.y + 32
      );
      // NOTE:  Is there a bug with drawLine? 
      // Shouldn't this draw a line from the center of the actor to the bottom right corner?
      // https://github.com/excaliburjs/Excalibur/issues/3117
      console.log('actor.pos', actor.pos);
      console.log('line.startingPos', startingPos);
      console.log('line.endingPos', endingPos);

      rotationReference.graphics.use(new Line({
        start: startingPos,
        end: endingPos,
        color: Color.Red
      }));
      this.add(rotationReference);
      // end debug: line for rotation direction
*/
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