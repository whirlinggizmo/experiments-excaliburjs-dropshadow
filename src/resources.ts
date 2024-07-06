import { ImageSource, Loader } from "excalibur";
import treetopTrimmed from "./assets/images/treetop-trimmed.png";
import treetopNotTrimmed from "./assets/images/treetop-not-trimmed.png";
import sun from "./assets/images/sun.png";
import paper from './assets/images/paper.jpg';

export const Resources = {
  TreetopTrimmed: new ImageSource(treetopTrimmed),
  TreetopNotTrimmed: new ImageSource(treetopNotTrimmed),
  Sun: new ImageSource(sun),
  Paper: new ImageSource(paper),
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
