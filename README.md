## Experiment:  Drop Shadows in Excalibur.js 
Some experiments with creating [Drop Shadows](https://en.wikipedia.org/wiki/Drop_shadow):


### DropShadowActor
An actor that draws its graphic twice, once with a black tint and opacity for a shadow, then again with the actual graphic.  The intent is to avoid breaking batching and restrictions that the shader encountered.  It also has a helper class to handle a basic directional and point light.  

The DropShadowActor demo can be found [here](https://whirlinggizmo.github.io/experiments-excaliburjs-dropshadow/)<br>

### DropShadowMaterial  
A material and shader to simulate a drop shadow filter.  Ultimately, this was discared since it disrupted some of the batching that Excaliber does for rendering.  Additionally, results were clipped because of the target texture not having enough white space for the shadow to draw.  Trimmed sprites in particular were problematic.  More experimentation around dynamically increasing the target texture size might be done.


_Caveat Emptor: My experiments are really just testbeds for some ideas that I've been considering.  As such, there will be broken code, bugs, odd comments and the like.  If you find something useful, _





