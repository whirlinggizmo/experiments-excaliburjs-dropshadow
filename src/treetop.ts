import { Actor, ImageSource, vec } from "excalibur";
import { Resources } from "./resources";

export class Treetop extends Actor {
  imageSource: ImageSource = Resources.TreetopTrimmed;
  constructor(imageSource: ImageSource) {
    super({
      pos: vec(0, 0),
      width: 64,
      height: 64
    });
    this.imageSource = imageSource;
  }

  override onInitialize() {
    this.graphics.add(this.imageSource.toSprite());
    this.on('pointerup', () => {
      alert('yo');
    });
  }
}

