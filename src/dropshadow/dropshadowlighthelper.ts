import { Actor, ActorArgs, Circle, Color, Engine, ExcaliburGraphicsContext, Keys, vec, Vector } from "excalibur";
import { DropShadowActor } from "./dropshadowactor";



export type DropShadowLightType = "point" | "directional";


export interface DropShadowLightHelperArgs {
    lightSourceDirection?: Vector;
    maxShadowLength?: number;
    lightSourceType?: DropShadowLightType;
    visualize?: boolean;
    dropShadowActors?: DropShadowActor[];
    interactive?: boolean;
    falloffRange?: number;
}

export class DropShadowLightHelper extends Actor {
    lightSourceDirection!: Vector;
    maxShadowLength!: number;
    falloffRange!: number;
    dropShadowActors!: DropShadowActor[];
    visualize: boolean;
    interactive: boolean;

    private _lightSourceType!: DropShadowLightType;
    public get lightSourceType(): DropShadowLightType {
        return this._lightSourceType;
    }
    public set lightSourceType(value: DropShadowLightType) {
        this.setLightSourceType(value);
    }

    constructor(actorAndDropShadowLightArgs?: ActorArgs & DropShadowLightHelperArgs) {
        super(actorAndDropShadowLightArgs);
        this.lightSourceDirection = actorAndDropShadowLightArgs?.lightSourceDirection ?? vec(5, 5);
        this.maxShadowLength = actorAndDropShadowLightArgs?.maxShadowLength ?? 5;
        this._lightSourceType = actorAndDropShadowLightArgs?.lightSourceType ?? "directional";
        this.dropShadowActors = actorAndDropShadowLightArgs?.dropShadowActors ?? [];
        this.visualize = actorAndDropShadowLightArgs?.visualize ?? false;
        this.interactive = actorAndDropShadowLightArgs?.interactive ?? false;
        this.falloffRange = actorAndDropShadowLightArgs?.falloffRange ?? 200;
    }

    onInitialize(_engine: Engine): void {
        this.anchor = Vector.Half;
        this.setLightSourceType(this._lightSourceType);
        if (!this.graphics.current) {
            this.graphics.add(new Circle({ radius: 10, color: Color.Orange }));
        }
        this.graphics.visible = this.visualize;

        this.graphics.onPostDraw = (ctx: ExcaliburGraphicsContext, elapsedMilliseconds: number) => {
            if (this.visualize) {
                this.drawLightSourceDirection(ctx, elapsedMilliseconds);
            }
        }

        this.setupInteractiveInputs(_engine);

        for (const actor of this.dropShadowActors) {
            actor.shadowOffset = this.lightSourceDirection;
            actor.maxShadowLength = this.maxShadowLength;
        }

        // for demo purposes, start the light icon in the center so it's obvious
        this.pos.x = _engine.currentScene.camera.viewport.center.x;
        this.pos.y = _engine.currentScene.camera.viewport.center.y;

    }

    addDropShadowActor(actor: DropShadowActor) {
        this.dropShadowActors.push(actor);
        actor.shadowOffset = this.lightSourceDirection;
        actor.maxShadowLength = this.maxShadowLength;
    }

    removeDropShadowActor(actor: DropShadowActor) {
        const index = this.dropShadowActors.indexOf(actor);
        if (index > -1) {
            this.dropShadowActors.splice(index, 1);
        }
    }

    setLightSourceType(type: DropShadowLightType) {
        if (this._lightSourceType === type) {
            return;
        }
        this._lightSourceType = type;
        switch (type) {
            case "directional":
                // this is an optimization, we could just set the offset/direction for each actor in the update method
                // like we do for the point light
                this.dropShadowActors?.forEach(actor => {
                    actor.shadowOffset = this.lightSourceDirection;
                    actor.maxShadowLength = this.maxShadowLength;
                });
                break;

            case "point":
                // we do this in the update, don't bother to set it here
                //this.dropShadowActors.forEach(actor => {
                //    actor.shadowOffset = this.lightSourceDirection.clone();
                //});
                break;

            default:
                console.warn(`Unknown DropShadowLight source type: ${this.lightSourceType}`);
                break;
        }
    }

    onPreUpdate(_engine: Engine, _deltaMS: number) {
        this.graphics.visible = this.visualize || this.interactive;
        switch (this.lightSourceType) {
            case "directional":
                this.updateDirectionalLight();
                break;
            case "point":
                this.updatePointLight();
                break;
            default:
                console.warn(`Unknown DropShadowLight source type: ${this.lightSourceType}`);
                break;
        }
    }

    private updatePointLight() {
        let lightSourceDirection: Vector;

        this.dropShadowActors.forEach(actor => {
            lightSourceDirection = actor.pos.sub(this.pos);
            const distance = lightSourceDirection.distance();
            let shadowLength = this.maxShadowLength;
            if (distance < this.falloffRange) {
                shadowLength *= distance / this.falloffRange;
            }
            actor.shadowOffset = lightSourceDirection.normalize().scale(shadowLength);


            //actor.shadowOffset = lightSourceDirection.normalize().scale(Math.max(0, this.maxShadowLength - distance));
            //actor.shadowOffset = lightSourceDirection;//.normalize().scale(distance);
            //actor.maxShadowLength = this.maxShadowLength;


            //actor.pos.distance(this.pos);
            //const shadowLength = Math.max(0, this.maxShadowLength - distance);

            // Calculate direction vector from light to actor
            //const direction = actor.pos.sub(this.pos).normalize();

            // Scale direction vector by shadowLength
            //actor.shadowOffset = direction.scale(shadowLength);



            //actor.maxShadowLength = this.maxShadowLength;
        });
    }

    private updateDirectionalLight() {
        // Nothing to do here since the actor shadowOffset is a reference to the lightSourceDirection.
        // They should be already updated as we change our lightSourceDirection
    }

    private drawLightSourceDirection(ctx: ExcaliburGraphicsContext, _elapsedMilliseconds: number) {
        switch (this.lightSourceType) {
            case 'directional':
                // visualize the directional light as a line that points in the direction of the light
                ctx.drawLine(Vector.Zero, this.lightSourceDirection.scale(ctx.width), Color.Orange, 3);
                break;
            case 'point':
                // draw light 'rays' from the source to the actors
                this.dropShadowActors.forEach(actor => {
                    //ctx.drawLine(actor.getGlobalPos(), actor.pos.add(actor.shadowOffset), Color.Orange, 3);
                    ctx.drawLine(Vector.Zero, actor.pos.sub(this.pos), Color.Orange, 3);
                });
                break;
            default:
                console.warn(`Unknown DropShadowLight source type: ${this.lightSourceType}`);
        }
    }

    setupInteractiveInputs(game: Engine) {
        // Update the shadow direction every mouse move
        game.input.pointers.primary.on('move', (evt) => {
            if (!this.interactive) {
                return;
            }
            // move the light source to the mouse location
            this.pos = evt.worldPos;
        });

        // enable some keyboard shortcuts to change the light source type
        game.input.keyboard.on('press', (evt) => {
            switch (evt.key) { // fun trick!
                case (Keys.Key1):
                    this.lightSourceType = 'directional';
                    break;
                case (Keys.Key2):
                    this.lightSourceType = 'point';
                    break;
                case (Keys.Key3):
                    this.visualize = !this.visualize;
                    break;
                case (Keys.Key0):
                    this.interactive = !this.interactive;
                    this.pos = game.input.pointers.primary.lastWorldPos;
                    break;

                default:
                    console.log(`Unknown key: ${evt.key}`);
            }
        });

        this.addInstructions(game);
    }


    addInstructions(_game: Engine) {
        const instructions = `
        <div class="topleft framed">
        <strong>Keyboard Controls</strong><br>
        <hr>
        1: Directional Light<br>
        2: Point Light<br>
        3: Toggle Line Visualization<br>
        0: Toggle Interactivity<br>
        </div>
        `;

        const ui = document.getElementById('ui');
        if (ui) {
            ui.innerHTML = instructions;
        }
    }
}