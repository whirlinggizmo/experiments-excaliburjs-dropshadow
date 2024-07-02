import { Actor, ActorArgs, Color, Engine, ExcaliburGraphicsContext, Vector, vec } from "excalibur";

export interface DropShadowArgs {
    shadowVisible?: boolean;
    shadowOpacity?: number;
    shadowOffset?: Vector;
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
    * The previous tint and opacity color of the actor.
    * Avoids allocation every draw frame.
    */
    private _previousTint!: Color;
    private _previousOpacity!: number;


    /**
     * Creates a new instance of `DropShadowActor`.
     * @param actorAndDropShadowArgs Optional arguments for the actor and drop shadow.
     */
    constructor(actorAndDropShadowArgs?: ActorArgs & DropShadowArgs) {
        super(actorAndDropShadowArgs);

        this.shadowVisible = actorAndDropShadowArgs?.shadowVisible ?? true;
        this.shadowOpacity = actorAndDropShadowArgs?.shadowOpacity ?? 0.3;
        this.shadowOffset = actorAndDropShadowArgs?.shadowOffset ?? vec(5, 5);
    }

    /**
     * Initializes the drop shadow actor and sets the pre-draw event to draw the shadow.
     */
    override onInitialize(_engine: Engine) {

        /**
         * Draw a shadow of any added graphics.  
         * Done before drawing the graphics themselves.
         */
        this.graphics.onPreDraw = (ctx: ExcaliburGraphicsContext) => {
            if (!this.shadowVisible) {
                return;
            }

            // set the shadow tint/opacity
            this._previousTint = ctx.tint;
            this._previousOpacity = ctx.opacity;
            ctx.tint = Color.Black;
            ctx.opacity = this.shadowOpacity;

            // loop through all graphics and draw them with the shadow offset
            for (const g of Object.values(this.graphics.graphics)) {
                g.draw(ctx, -g.width * this.anchor.x + this.shadowOffset.x, -g.height * this.anchor.y + this.shadowOffset.y);
            }

            // put the tint and opacity back for the rest of the drawing
            ctx.opacity = this._previousOpacity;
            ctx.tint = this._previousTint;
        };
    }
}

