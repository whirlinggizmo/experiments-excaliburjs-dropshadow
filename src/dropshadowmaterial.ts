import { Color, Material, Vector } from 'excalibur';


///////////////////////////////
// Drop shadow material + shader
export function createDropShadowMaterial(graphicsContext: ex.ExcaliburGraphicsContext, shadowColor: ex.Color, shadowOffset: ex.Vector) {
    // fragment shader
    const dropShadowFragmentSource =
        `#version 300 es
        precision mediump float;

        uniform sampler2D u_graphic;
        uniform vec4 u_shadowColor;
        uniform vec2 u_shadowOffset;

        in vec2 v_uv;
        out vec4 fragColor;

        void main() {
            vec2 aspect = 1.0 / vec2(textureSize(u_graphic, 0));

            // Sample the texture at the shadow offset position
            vec4 shadowColor = texture(u_graphic, v_uv + u_shadowOffset * aspect);
            
            // Apply the shadow color
            vec4 finalShadowColor = shadowColor * u_shadowColor;

            // Sample the original texture
            vec4 originalColor = texture(u_graphic, v_uv);

            // Combine the shadow color and the original color
            fragColor = mix(finalShadowColor, originalColor, originalColor.a);
        }`;

    shadowColor = shadowColor || new Color(0, 0, 0, 0.3);
    shadowOffset = shadowOffset || new Vector(-5, -5);

    const dropshadowMaterial = new Material({
        fragmentSource: dropShadowFragmentSource,
        name: 'dropshadow',
        graphicsContext: graphicsContext
    });

    dropshadowMaterial.update((shader) => {
        shader.setUniformFloatColor('u_shadowColor', shadowColor);
        shader.setUniformFloatVector('u_shadowOffset', shadowOffset);
    });

    return dropshadowMaterial;
}