class BoxSprite {
    constructor(x = 0, y = 0, width = 10, height = 10) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Updates the position and dimensions of the box to be drawn
    update = (x = this.x, y = this.y, width = this.width, height = this.height) => {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Draws a box with specified parameters
    draw = (ctx, fillStyle = "black", strokeStyle = "black") => { 
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = strokeStyle;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.strokeRect(0, 0, this.width, this.height);
        ctx.restore();
    }
}

class CircleSprite {
    constructor(x = 0, y = 0, radius = 5) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    // Updates the position and radius of the circle to be drawn
    update = (x = this.x, y = this.y, radius = this.radius) => {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    // Draws a circle with specified parameters
    draw = (ctx, startAngle, endAngle, drawReverse, fillStyle) => {
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, startAngle, endAngle, drawReverse);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

export { BoxSprite, CircleSprite };