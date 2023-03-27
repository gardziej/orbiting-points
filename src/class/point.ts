import App from "../app";
import Vector2 from "./vector2";

export default class Point {

  private radius: number = 3;
  public newDiffAngle: number = null;
  public shouldBeDestroyed: boolean = false;
  public angle: number = 0;

  public get position(): Vector2 {
    return new Vector2(
      this.app.canvas.center.x + Math.cos(this.angle) * this.app.radius,
      this.app.canvas.center.y + Math.sin(this.angle) * this.app.radius
    );
  }

  public constructor(
    public diffAngle: number,
    private app: App
    ) {
      this.angle = this.app.baseAngle + diffAngle;
      if (this.angle > 2 * Math.PI) {
        this.angle -= 2 * Math.PI;
      }
  }

  public setNewDiffAngle(newDiffAngle: number): void {
    this.newDiffAngle = newDiffAngle;
  }

  private diff(x: number, y: number): number {
    let d = y - x;
    if (Math.abs(d) > Math.PI) {
      d = 2 * Math.PI - Math.abs(d);
    }

    if (x + d === y || x + d - 2 * Math.PI === y) {
      return d;
    }
    else {
      return -d;
    }
  }

  public update(): void {
    if (this.newDiffAngle !== null) {
      const diff: number = this.diff(this.diffAngle, this.newDiffAngle);
      const margin: number = 0.05;
      if (Math.abs(diff) > margin) {
        if (diff > 0) {
          this.diffAngle += 0.03;
        }
        else if (diff < 0) {
          this.diffAngle -= 0.05;
        }
      }
      else {
        this.diffAngle = this.newDiffAngle;
        this.newDiffAngle = null;
      }
    }
    this.angle = this.app.baseAngle + this.diffAngle;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = 'white';
    ctx.font = "16px Arial";
    //ctx.fillText(String(Math.round(this.angle * (180 / Math.PI))), this.position.x, this.position.y + 5);
    ctx.restore();
  }

}