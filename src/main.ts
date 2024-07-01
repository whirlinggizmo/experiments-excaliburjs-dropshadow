import { Color, Engine, Vector, Font, Label, vec, Actor, TextAlign, DisplayMode } from "excalibur";
import { Resources, loader } from "./resources";
import { Treetop } from "./treetop";
import { createDropShadowMaterial } from "./dropshadowmaterial";
import { isMobile } from "./util/platform";

function addLabel(actor: Actor, text: string) {
  const label = new Label({
    pos: vec(0, actor.height / 2 + 10),
    text: text,
    font: new Font({
      size: 18,
      textAlign: TextAlign.Center,
      family: 'arial',
    }),
    color: Color.White,

  });
  actor.addChild(label);
}

class Game extends Engine {
  constructor() {
    super({
      width: isMobile ? 1280 / 4 : 1920,
      height: isMobile ? 2280 / 4 : 1080,
      displayMode: DisplayMode.FitScreen,
      canvasElementId: 'renderCanvas',
    });
  }
  initialize() {
    const verticalSpacing = 100;
    const dropShadowMaterial = createDropShadowMaterial(this.graphicsContext, new Color(0, 0, 0, 0.3), new Vector(-5, -5));
    let currentYPosition = 0;

    // treetop, trimmed sprite, no shadow material
    const treetop_no_shadow = new Treetop(Resources.TreetopTrimmed);
    treetop_no_shadow.pos.y = currentYPosition;
    this.add(treetop_no_shadow);
    addLabel(treetop_no_shadow, 'No shadow');
    currentYPosition += treetop_no_shadow.width + verticalSpacing;
    // Note: no drop shadow material set

    // treetop, trimmed sprite + shadow material
    const treetop_trimmed_shadow = new Treetop(Resources.TreetopTrimmed);
    treetop_trimmed_shadow.pos.y = currentYPosition;
    this.add(treetop_trimmed_shadow);
    addLabel(treetop_trimmed_shadow, 'Trimmed sprite\n(No empty space around sprite, shadow is clipped)');
    currentYPosition += treetop_trimmed_shadow.width + verticalSpacing;
    // set the drop shadow material
    treetop_trimmed_shadow.graphics.material = dropShadowMaterial;

    // treetop, untrimmed sprite + shadow material
    const treetop_not_trimmed = new Treetop(Resources.TreetopNotTrimmed);
    treetop_not_trimmed.pos.y = currentYPosition;
    this.add(treetop_not_trimmed);
    addLabel(treetop_not_trimmed, 'Untrimmed sprite\n(empty space around sprite, shadow is not clipped)');
    currentYPosition += treetop_not_trimmed.width * 2;
    // set the drop shadow material
    treetop_not_trimmed.graphics.material = dropShadowMaterial;

    // look at the middle tree for centering
    this.currentScene.camera.strategy.lockToActor(treetop_trimmed_shadow);

    this.start(loader);
  }
}

export const game = new Game();
game.initialize();