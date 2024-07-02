import { Color, Engine, Vector, Font, Label, vec, Actor, TextAlign, DisplayMode } from "excalibur";
import { Resources, loader } from "./resources";
import { Treetop } from "./treetop";
import { createDropShadowMaterial } from "./dropshadowmaterial";
import { isMobile } from "./util/platform";
import { DropShadowActor } from "./dropshadowactor";

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
    currentYPosition += treetop_no_shadow.height + verticalSpacing;
    // Note: no drop shadow material set

    // treetop, trimmed sprite + shadow material
    const treetop_trimmed_shadow = new Treetop(Resources.TreetopTrimmed);
    treetop_trimmed_shadow.pos.y = currentYPosition;
    this.add(treetop_trimmed_shadow);
    addLabel(treetop_trimmed_shadow, 'Trimmed Sprite + DropShadowMaterial\n - No empty space around sprite\n - Shadow is clipped');
    currentYPosition += treetop_trimmed_shadow.height + verticalSpacing;
    // set the drop shadow material
    treetop_trimmed_shadow.graphics.material = dropShadowMaterial;

    // treetop, untrimmed sprite + shadow material
    const treetop_not_trimmed_shadow = new Treetop(Resources.TreetopNotTrimmed);
    treetop_not_trimmed_shadow.pos.y = currentYPosition;
    this.add(treetop_not_trimmed_shadow);
    addLabel(treetop_not_trimmed_shadow, 'Untrimmed Sprite + DropShadowMaterial\n - Extra empty space around sprite\n - Shadow is not clipped');
    currentYPosition += treetop_not_trimmed_shadow.height + verticalSpacing;
    // set the drop shadow material
    treetop_not_trimmed_shadow.graphics.material = dropShadowMaterial;

    // add a DropShadowActor to compare
    const dropShadowActor = new DropShadowActor({
      pos: vec(0, currentYPosition),
      width: 64,
      height: 64
    });
    dropShadowActor.graphics.add(Resources.TreetopTrimmed.toSprite());
    this.add(dropShadowActor);
    addLabel(dropShadowActor, 'DropShadowActor\n - No DropShadowMaterial\n - No empty space around sprite\n - Shadow is not clipped');
    currentYPosition += treetop_no_shadow.height + verticalSpacing;


    // look at the third tree for centering
    this.currentScene.camera.strategy.lockToActor(treetop_not_trimmed_shadow);

    this.start(loader);
  }
}

export const game = new Game();
game.initialize();