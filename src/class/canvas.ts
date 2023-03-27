import Boundaries from "./boundaries";
import Vector2 from "./vector2";

export default class Canvas {

  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  private canvasOffset: Vector2;

  public constructor(
    private id: string,
    public dim: Vector2 = Vector2.zero
  ) {
    this.canvas = document.createElement('canvas');
    
    window.addEventListener('resize', () => {
      dim.x = this.canvas.width = window.innerWidth;
      dim.y = this.canvas.height = window.innerHeight;
    });

    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    if (!dim.isZero) {
      this.canvas.width = dim.x;
      this.canvas.height = dim.y;
    } else {
      dim.x = this.canvas.width = window.innerWidth;
      dim.y = this.canvas.height = window.innerHeight;
    }
    this.canvas.setAttribute('id', this.id);
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvasOffset = new Vector2(this.canvas.offsetLeft, this.canvas.offsetTop);
  }

  public get width(): number {
    return this.canvas.width;
  }

  public get height(): number {
    return this.canvas.height;
  }

  public get center(): Vector2 {
    return new Vector2(this.canvas.width / 2, this.canvas.height / 2);
  }

  public get offset(): Vector2 {
    return this.canvasOffset;
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public getBoundaries(): Boundaries {
    return new Boundaries(Vector2.zero, new Vector2(this.canvas.width, this.canvas.height));
  }

  public setDefaultCursor(): void {
    this.canvas.style.cursor = 'default';
  }

  public setPointerCursor(): void {
    this.canvas.style.cursor = 'pointer';
  }

  public setMoveCursor(): void {
    this.canvas.style.cursor = 'move';
  }

}