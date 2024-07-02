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
     * The tint color of the shadow.
     * Avoid creating a new Color object every draw frame.
     */
    private _shadowTint: Color;

    /**
     * The previous tint color of the actor.
     * Avoid creating a new Color object every draw frame.
     */
    private _previousTint!: Color;

    /**
     * The opacity of the shadow.
     */
    private _shadowOpacity: number;

    /**
     * Gets the opacity of the shadow.
     */
    public get shadowOpacity(): number {
        return this._shadowOpacity;
    }

    /**
     * Sets the opacity of the shadow.
     */
    public set shadowOpacity(value: number) {
        this._shadowOpacity = value;
        this._shadowTint.a = this._shadowOpacity;
    }

    /**
     * Creates a new instance of `DropShadowActor`.
     * @param actorAndDropShadowArgs Optional arguments for the actor and drop shadow.
     */
    constructor(actorAndDropShadowArgs?: ActorArgs & DropShadowArgs) {
        super(actorAndDropShadowArgs);

        this.shadowVisible = actorAndDropShadowArgs?.shadowVisible ?? true;
        this._shadowOpacity = actorAndDropShadowArgs?.shadowOpacity ?? 0.5;
        this._shadowTint = new Color(0, 0, 0, this._shadowOpacity);
        this.shadowOffset = actorAndDropShadowArgs?.shadowOffset ?? vec(3, 3);
    }

    /**
     * Initializes the drop shadow actor and sets the pre-draw event to draw the shadow.
     */
    override onInitialize(_engine: Engine) {
        // draw a shadow of the added graphics before drawing the graphics
        this.graphics.onPreDraw = (ctx: ExcaliburGraphicsContext) => {
            if (!this.shadowVisible) {
                return;
            }

            // set the shadow tint/opacity
            this._previousTint = ctx.tint;
            ctx.tint = this._shadowTint;

            // loop through all graphics and draw them with the shadow offset
            for (const g of Object.values(this.graphics.graphics)) {
                g.draw(ctx, -g.width * this.anchor.x + this.shadowOffset.x, -g.height * this.anchor.y + this.shadowOffset.y);
            }

            // put the tint back for the rest of the drawing
            ctx.tint = this._previousTint;
        };
    }
}

