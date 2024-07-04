import { Actor, ActorArgs, Color, Engine, ExcaliburGraphicsContext, Vector, vec } from "excalibur";

export interface DropShadowArgs {
    shadowVisible?: boolean;
    shadowOpacity?: number;
    shadowOffset?: Vector;
    shadowOnly?: boolean;
}
/**
 * Represents an actor with a drop shadow effect.
 */
export class DropShadowActor extends Actor {
    /**
     * Determines whether the shadow is visible or not.
     */
    public shadowVisible: boolean;

    /**
     * The offset of the shadow from the actor.
     */
    public shadowOffset: Vector;

    /**
     * The opacity of the shadow.
     */
    public shadowOpacity: number;

    /**
     * Draw only the shadows
     */
    public shadowOnly: boolean;

    /**
     * Creates a new instance of `DropShadowActor`.
     * @param actorAndDropShadowArgs Optional arguments for the actor and drop shadow.
     */
    constructor(actorAndDropShadowArgs?: ActorArgs & DropShadowArgs) {
        super(actorAndDropShadowArgs);

        this.shadowVisible = actorAndDropShadowArgs?.shadowVisible ?? true;
        this.shadowOpacity = actorAndDropShadowArgs?.shadowOpacity ?? 0.3;
        this.shadowOffset = actorAndDropShadowArgs?.shadowOffset ?? vec(5, 5);
        this.shadowOnly = actorAndDropShadowArgs?.shadowOnly ?? false;
    }


    /**
     * Initializes the drop shadow actor and sets the pre-draw event to draw the shadow.
     * 
     * @param _engine The engine instance.
     */
    override onInitialize(_engine: Engine) {
        // Store the previous visibility of the graphics so we can reset it
        // Used for shadowsOnly rendering
        let previousGraphicVisibility: boolean;


        this.graphics.onPreDraw = (_ctx: ExcaliburGraphicsContext, _elapsedMilliseconds: number) => {
            // Turn off the graphic visiblity, we control all the drawing in onPostDraw
            previousGraphicVisibility = this.graphics.visible;
            this.graphics.visible = false;
        };

        /**
         * If we turned off the graphics visibility to draw only the shadows,
         * we need to reset the visibility of the graphics.
         */
        this.graphics.onPostDraw = (_ctx: ExcaliburGraphicsContext, _elapsedMilliseconds: number) => {
            // Draw the shadows
            if (this.shadowVisible) {
                _drawShadows(_ctx);
            }

            // restore the graphic visibility
            this.graphics.visible = previousGraphicVisibility;

            // draw the graphics if we're not in shadowOnly mode
            if (!this.shadowOnly) {
                _drawGraphics(_ctx);
            }
        }


        /**
         * Draws the shadows for the actor.
         * @param ctx - The ExcaliburGraphicsContext used for drawing.
         */
        const _drawShadows = (ctx: ExcaliburGraphicsContext) => {
            if (!this.shadowVisible) {
                return;
            }

            if (this.graphics.current) {
                // Save the context, we change the tint and opacity for shadows
                ctx.save();
                ctx.tint = Color.Black;
                ctx.opacity = this.shadowOpacity;

                // Calculate cosine and sine of the rotation angle
                const cosRotation = Math.cos(this.rotation);
                const sinRotation = Math.sin(this.rotation);

                // Apply rotation to the shadow offset
                const x = this.shadowOffset.x * cosRotation - this.shadowOffset.y * sinRotation;
                const y = this.shadowOffset.x * sinRotation + this.shadowOffset.y * cosRotation;

                /*
                console.debug('this.rotation', this.rotation);
                console.debug('this.graphics.current.rotation', this.graphics.current.rotation);
                console.debug('this.shadowOffset', this.shadowOffset);
                console.debug('rotated shadowOffset', vec(x, y));
                */

                // Draw the graphics with the black tint and opacity, giving it a shadow effect
                // Adjust the drawing position to ensure it aligns with the rotated offset correctly
                this.graphics.current.draw(
                    ctx,
                    -this.graphics.current.width * this.anchor.x - x,
                    -this.graphics.current.height * this.anchor.y - y
                );

                // Restore the context
                ctx.restore();
            }
        };

        const _drawGraphics = (ctx: ExcaliburGraphicsContext) => {
            if (this.graphics.current) {
                this.graphics.current.draw(
                    ctx,
                    -this.graphics.current.width * this.anchor.x,
                    -this.graphics.current.height * this.anchor.y
                );
            }
        };

    }
}


