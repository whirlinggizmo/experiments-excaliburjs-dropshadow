import { ImageSource, Loader } from "excalibur";
import treetopTrimmed from "./images/treetop-trimmed.png";
import treetopNotTrimmed from "./images/treetop-not-trimmed.png";

export const Resources = {
  TreetopTrimmed: new ImageSource(treetopTrimmed),
  TreetopNotTrimmed: new ImageSource(treetopNotTrimmed),
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
