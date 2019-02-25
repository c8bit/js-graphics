class EquilateralTriangle
{

  constructor(side, coords, rotation)
  {
    // The length of a side of the triangle
    this.side = side;
    // The canvas x.y coords of the upper-left corner of the bounding box.
    this.coords = coords;
    // The global clockwise rotation of the triangle, in radians.
    this.rotation = rotation;
    // The length of a side of the bounding box.
    this.boundingBoxSide = Math.ceil(this.inscribingCircleRadius * 2);
  }

  // Distance from triangle base to a corner.
  get height()
  {
    return this.side * Math.sin(Math.PI / 3.0);
  }

  // The distance from the triangle midpoint to a corner of the triangle.
  //   This is the radius of the circle in which this triangle is
  //   inscribed. The diameter of that circle defines the length
  //   of a side of the bounding box of the triangle.
  get inscribingCircleRadius()
  {
    return this.side / (2 * Math.sin(Math.PI / 3.0));
  }

  convertToBoxCoords({x: x, y: y})
  {
    // Convert coords to the bounding box drawing space
    x += (this.boundingBoxSide / 2);
    y *= -1;
    y += (this.boundingBoxSide / 2);
    
    return {x: x, y: y};
  }

  convertToCanvasCoords({x: x, y: y})
  {
    x += this.coords.x;
    y += this.coords.y;

    return {x: x, y: y};
  }

  coordsForPoint({rotation: pointRotation, amplitude: pointAmplitude})
  {
    // cosine of the triangle rotation, multiplied by the amplitude
    var x = Math.cos(pointRotation) * pointAmplitude;
    // sine of the triangle rotation, multiplied by the amplitude
    var y = Math.sin(pointRotation) * pointAmplitude;

    return {x: x, y: y};
  }

  // Points 0, 1, and 2 start from 0 radians going counterclockwise
  coordsForIndex(pointIndex)
  {
    let theta = this.rotation + (pointIndex * ((2 * Math.PI) / 3));
    var rotation = theta % (2 * Math.PI);

    return this.coordsForPoint({rotation: rotation, amplitude: this.inscribingCircleRadius});
  }
  boxCoordsForIndex(pointIndex)
  {
    return this.convertToBoxCoords(this.coordsForIndex(pointIndex));
  }
  canvasCoordsForIndex(pointIndex)
  {
    return this.convertToCanvasCoords(this.boxCoordsForIndex(pointIndex));
  }

  drawInnerArcForIndex(pointIndex, context)
  {
    var rotation = (Math.PI / 3) + (pointIndex * ((2 * Math.PI) / 3.0));
    var amplitude = this.inscribingCircleRadius * 1.1;

    var {x: focusX, y: focusY} = this.convertToCanvasCoords(this.convertToBoxCoords(this.coordsForPoint({rotation: rotation, amplitude: amplitude})))
    console.log(focusX, focusY);
    //console.log(rotation / Math.PI);

    let radiansToDraw = (2 * Math.PI) / 3;
    let focusCircleChordRadians = (Math.PI + rotation) % (2 * Math.PI);
    var degreesToStart = focusCircleChordRadians - (radiansToDraw / 2);
    if (degreesToStart < 0)
    {
      degreesToStart = degreesToStart + (Math.PI * 2);
    }
    var degreesToEnd = (focusCircleChordRadians + (radiansToDraw / 2)) % (2 * Math.PI);
    

    //ctx.moveTo(focusX, focusY);
    ctx.beginPath();

    ctx.arc(focusX, focusY,
        amplitude * 1.1,             // radius
        (2 * Math.PI) - degreesToEnd, (2 * Math.PI) - degreesToStart, // Degrees to start, degrees to end: so, draw 1/4 circle
        false);          // True means draw counterclockwise

    ctx.stroke();
  }


};

var triangle = new EquilateralTriangle(200, {x: 0, y: 10}, 0);



//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics
var canvas = document.querySelector('#canvas');
var width = canvas.width;
var height = canvas.height;

var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, width, height);


ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.strokeStyle = 'rgb(255, 255, 255)';
ctx.lineWidth = 5;


for (var i = 0; i < 3; i++)
{
  triangle.drawInnerArcForIndex(i, ctx);
  //var {x: coordX, y: coordY} = triangle.canvasCoordsForIndex(i);
  //ctx.moveTo(coordX, coordY);
  //ctx.beginPath();

  //var rotation = (Math.PI / 3) + (i * ((2 * Math.PI) / 3.0));
  //var amplitude = triangle.inscribingCircleRadius;
  //var {x: fociX, y: fociY} = triangle.convertToCanvasCoords(triangle.convertToBoxCoords(triangle.coordsForPoint({rotation: rotation, amplitude: amplitude})));
  //ctx.arc(fociX, fociY,
  //    amplitude,             // radius
  //    Math.PI / 2, 0, // Degrees to start, degrees to end: so, draw 1/4 circle
  //    true);          // True means draw counterclockwise
  //ctx.stroke();
}


