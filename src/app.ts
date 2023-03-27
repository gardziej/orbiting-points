import Canvas from "./class/canvas";
import FpsLimiter from "./class/fpsLimiter";
import Point from "./class/point";

export default class App {
  private fpsLimiter = new FpsLimiter(this);
  public canvas: Canvas = new Canvas('canvas');
  private points: Point[] = [];
  public radius: number = 0;
  private MAX_RADIUS: number = Math.min(this.canvas.width * 0.4, this.canvas.height * 0.4);
  private MIN_POINTS: number = 2;
  private MAX_POINTS: number = 64;
  public adding: boolean = true;
  public baseAngle: number = 0;
  
  private img: HTMLImageElement = new Image();

  public constructor() {
    this.img.src = "assets/canvas_createpattern.png";
    this.init();
  }

  private init(): void {
    this.addPoint(this.baseAngle);
    this.changePoints();
  }

  private addPoint(angle: number): Point {
    const newPoint: Point = new Point(angle, this);
    this.points.push(newPoint);
    this.setNewAngles();
    return newPoint;
  }

  private changePoints(timer: number = 0): void {
    setTimeout(() => {
      if (this.points.length >= this.MAX_POINTS) {
        this.adding = false;
      } else if (this.points.length <= this.MIN_POINTS) {
        this.adding = true;
      }
      if (this.adding) {
        this.addPoint(this.points[this.points.length - 1].diffAngle);
      }
      else {
        this.removePoint();
      }
      this.changePoints(3000 / this.points.length);
    }, timer);
  }

  private setNewAngles(): void {
    const shouldBeDestroyed: boolean = this.points[this.points.length - 1].shouldBeDestroyed;
    const length: number = this.points.length - Number(shouldBeDestroyed);
    const step: number = 2 * Math.PI / length;
    for (let i = 1; i < length; i++) {
      const newDiffAngle: number = (i * step);
      this.points[i].setNewDiffAngle(newDiffAngle);
    }
    if (shouldBeDestroyed) {
      this.points[this.points.length - 1].setNewDiffAngle(this.points[this.points.length - 2].newDiffAngle);
    }
  }

  private removePoint(): void {
    if (this.points.length < 2) return;
    const lastPoint = this.points[this.points.length - 1];
    lastPoint.setNewDiffAngle(this.points[this.points.length - 2].diffAngle);
    lastPoint.shouldBeDestroyed = true;
    this.setNewAngles();
  }

  public destroyPoint(): void {
    if (this.points[this.points.length - 1].shouldBeDestroyed && 
        this.points[this.points.length - 2].newDiffAngle !== null &&
      this.points[this.points.length - 1].diffAngle > this.points[this.points.length - 2].diffAngle) {
      this.points[this.points.length - 1].newDiffAngle = this.points[this.points.length - 2].diffAngle;
    }
    else if (this.points[this.points.length - 1].shouldBeDestroyed) {
      this.points.pop();
    }
  }

  public tick(): void {
    this.update();
    this.render();
  }

  public update(): void {

    if (this.adding && this.radius < this.MAX_RADIUS) {
      this.radius += 0.5;
    }
    else if (!this.adding && this.radius > 2) {
      this.radius -= 0.2;
    }

    this.baseAngle += 0.01;
    if (this.baseAngle > 2 * Math.PI) {
      this.baseAngle -= 2 * Math.PI;
    }
    this.points.forEach(child => child.update());
    this.destroyPoint();
  }

  public render(): void {
    this.canvas.clear();
    this.renderLines(this.canvas.ctx);
    this.points.forEach(child => child.render(this.canvas.ctx));
  }

  private renderLines(ctx: CanvasRenderingContext2D): void {
    if (this.points.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < this.points.length; i++) {
      if (i < this.points.length - 1) {
        ctx.lineTo(this.points[i+1].position.x, this.points[i+1].position.y);
      }
      else {
        ctx.lineTo(this.points[0].position.x, this.points[0].position.y);
      }
    }
    // ctx.stroke();
    const pattern = ctx.createPattern(this.img, "no-repeat");
    pattern.setTransform(
      new DOMMatrix(
        [
          // No rotation, 1-1 scale
          1, 0, 0, 1,
          // Translate to center, offset by half-image
          this.canvas.width / 2 - this.img.width / 2,
          this.canvas.height / 2 - this.img.height / 2
        ])
    );
    ctx.fillStyle = pattern;
    ctx.fill();
    ctx.restore();
  }
}

new App();