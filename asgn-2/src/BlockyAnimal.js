// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_Size;
  let u_ModelMatrix;
  let u_GlobalRotateMatrix;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    
}

function connectVariables() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // get storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // get storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // set an initial value for u_ModelMatrix to the identity matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  // if (!u_Size) {
  //   console.log('Failed to get the storage location of u_Size');
  //   return;
  // }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const RANDOM = 3;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_size = 5;
let g_selectedType = POINT;
let g_segments = 10;
let g_globalAngle = 0;
let g_armAngle = 0;
let g_handAngle = 0;
let g_seconds = 0;
let g_armAnimation = true;
let g_handAnimation = true;
let g_eyeColor = [1.0, 1.0, 1.0, 1.0];
let g_eyeAnimation = true;
let g_legAnimation = true;
let g_leftLegVertical = 0;
let g_rightLegVertical = 0;
let g_batonAnimation = true;
let g_batonAngle = 0;

let eyesLegs = true;

let fly = false;
let flyVertical = 0;


function HTML_UI_functions() {
  document.getElementById('fly').onclick = function() {
      fly = !fly;
  };

  document.getElementById('eyesLegsOn').onclick = function() {
    eyesLegs = true;
  };

  document.getElementById('eyesLegsOff').onclick = function() {
    eyesLegs = false;
  };

  // armOn and armOff buttons
  document.getElementById('armOn').onclick = function() {
    g_armAnimation = true;
  };

  document.getElementById('armOff').onclick = function() {
    g_armAnimation = false;
  };

  // handOn and handOff buttons
  document.getElementById('handOn').onclick = function() {
    g_handAnimation = true;
  };

  document.getElementById('handOff').onclick = function() {
    g_handAnimation = false;
  };


  document.getElementById('armSlide').addEventListener("mousemove", function() {
    g_armAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('handSlide').addEventListener("mousemove", function() {
    g_handAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('angleSlide').addEventListener("mousemove", function() {
    g_globalAngle = this.value;
    renderAllShapes();
  });

}

var g_startTime = performance.now()/1000.0;

var ticking;

function ticking() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  // console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(ticking);
}

function main() {

  setupWebGL();

  connectVariables();

  HTML_UI_functions();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) click(ev); };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  ticking();
  requestAnimationFrame(ticking);
}

main();





var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {

  let [x, y] = convertCoords(ev);

  let point;
  if(g_selectedType == POINT) {
    point = new Point();
  } else if(g_selectedType == TRIANGLE) {
    point = new Triangle();
  }
  else if(g_selectedType == CIRCLE) {
    point = new Circle();
  }
  else if(g_selectedType == RANDOM) {
    let rand = Math.random();
    if(rand < 0.33) {
      point = new Point();
    } else if(rand < 0.66) {
      point = new Triangle();
    } else {
      point = new Circle();
    }
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_size;
  if (g_selectedType == CIRCLE) {
    point.segments = g_segments;
  }
  if (g_selectedType == RANDOM) {
    point.position = [Math.random()*2-1, Math.random()*2-1];
    point.color = [Math.random(), Math.random(), Math.random(), 1.0];
    point.size = Math.random()*50+10;
    if (point.type == "circle") {
      point.segments = Math.floor(Math.random()*10);
    }
  }
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // g_colors.push(g_selectedColor.slice());

  // g_sizes.push(g_size);
  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes();

}

function convertCoords(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);

}

// update angles if currently animated
function updateAnimationAngles() {
  if (eyesLegs) {
    g_eyeAnimation = true;
    g_legAnimation = true;
    g_batonAnimation = true;
  }
  else {
    g_eyeAnimation = false;
    g_legAnimation = false;
    g_batonAnimation = false;
  }


  if (g_armAnimation) {
    g_armAngle = 30*Math.sin(g_seconds)+15;
  }
  if (g_handAnimation) {
    g_handAngle = 45*Math.sin(3*g_seconds);
  }

  // robot's eyes should change color with time
  if (g_eyeAnimation){
    g_eyeColor = [Math.abs(Math.sin(g_seconds)), Math.abs(Math.cos(g_seconds)), Math.abs(Math.sin(2*g_seconds)), 1.0];
  }
  if (g_legAnimation){
    g_leftLegVertical = 0.25*Math.sin(g_seconds);
    g_rightLegVertical = 0.25*Math.cos(g_seconds);
  }

  if (g_batonAnimation) {
    g_batonAngle = 10*Math.sin(g_seconds);
  }

  if (fly) {
    flyVertical = flyVertical + 0.01;
  }
  else {
    if (flyVertical > 0) {
    flyVertical = flyVertical - 0.01;
    }
  }

}

function renderAllShapes() {

  var StartTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);


  // drawTriangle3D([
  //   -1.0, 0.0, 0.0, 
  //   -0.5, -1.0, 0.0,
  //   0.0, 0.0, 0.0]);
    // drawing a robot with 8 cubes: head, body, 2 arms, 2 hands, 2 legs

    // draw the body cube
    var body = new Cube([0.2, 0.2, 0.8, 1.0]);
    // blue
    // body.color = [0.2, 0.2, 0.8, 1.0];
    body.matrix.translate(-0.25, -0.4+flyVertical, 0.0);
    body.matrix.scale(0.5, 1.0, 0.5);
    body.render();

    // draw a left arm

    var leftArm = new Cube([1.0, 1.0, 0.0, 1.0]);
    // leftArm.color = [1.0, 1.0, 0.0, 1.0];
    leftArm.matrix.setTranslate(-0.1, 0.1+flyVertical, 0.02);
    leftArm.matrix.rotate(45, 0, 0, 1);
    leftArm.matrix.rotate(g_armAngle, 0, 0, 1);

    var armCoordsMat = new Matrix4(leftArm.matrix);
    leftArm.matrix.scale(0.25, 0.7, 0.45);
    leftArm.render();

    // draw a left hand on the arm

    var leftHand = new Cube([0.0, 1.0, 1.0, 1.0]);
    // leftHand.color = [0.0, 1.0, 1.0, 1.0];
    leftHand.matrix = armCoordsMat;
    leftHand.matrix.translate(0.1, 0.6, 0.101);
    leftHand.matrix.scale(0.25, 0.25, 0.25);
    leftHand.matrix.rotate(g_handAngle+45, 0, 0, 1);
    leftHand.render();

    // draw a right arm
    var rightArm = new Cube([1.0, 1.0, 0.0, 1.0]);
    // rightArm.color = [1.0, 1.0, 0.0, 1.0];
    rightArm.matrix.setTranslate(0.1, 0.1+flyVertical, 0.02);
    // flip it around
    rightArm.matrix.scale(-1, 1, 1);
    rightArm.matrix.rotate(45, 0, 0, 1);
    rightArm.matrix.rotate(g_armAngle, 0, 0, 1);
    var rightArmCoordsMat = new Matrix4(rightArm.matrix);
    rightArm.matrix.scale(0.25, 0.7, 0.45);
    rightArm.render();

    // draw a right hand on the arm
    var rightHand = new Cube([0.0, 1.0, 1.0, 1.0]);
    // rightHand.color = [0.0, 1.0, 1.0, 1.0];
    rightHand.matrix = rightArmCoordsMat;
    rightHand.matrix.translate(0.1, 0.6, 0.101);
    rightHand.matrix.scale(0.25, 0.25, 0.25);
    rightHand.matrix.rotate(g_handAngle+45, 0, 0, 1);
    var rightHandCoordsMat = new Matrix4(rightHand.matrix);
    rightHand.render();

    // in his right hand, he holds a stick, which also moves with time
    var stick = new Cube([0.5, 0.5, 0.5, 1.0]);
    stick.matrix = rightHandCoordsMat;
    stick.matrix.rotate(g_batonAngle+5, 0, 0, 1);
    stick.matrix.translate(0.4, 0.2, 0.1);
    stick.matrix.scale(2, 0.5, 0.5);
    stick.render();

    // draw the head cube
    // but first a neck
    var neck = new Cube([0.0, 1.0, 0.0, 1.0]);
    // neck.color = [0.0, 1.0, 0.0, 1.0];
    neck.matrix.translate(-0.05, 0.6+flyVertical, 0.15);
    neck.matrix.scale(0.1, 0.1, 0.1);
    neck.render();

    // now a head
    var head = new Cube([1.0, 0.0, 0.0, 1.0]);
    // head.color = [1.0, 0.0, 0.0, 1.0];
    head.matrix.translate(-0.15, 0.7+flyVertical, 0.1);
    head.matrix.scale(0.3, 0.27, 0.3);
    head.render();

    // draw two square eyes on the head
    var leftEye = new Cube();
    leftEye.color = g_eyeColor;
    leftEye.matrix.translate(0.05, 0.85+flyVertical, 0.05);
    leftEye.matrix.scale(0.05, 0.05, 0.05);
    leftEye.render();

    var rightEye = new Cube();
    rightEye.color = g_eyeColor;
    rightEye.matrix.translate(-0.1, 0.85+flyVertical, 0.05);
    rightEye.matrix.scale(0.05, 0.05, 0.05);
    rightEye.render();

    // draw a mouth underneath the eyes
    var mouth = new Cube([1.0, 1.0, 1.0, 1.0]);
    // mouth.color = [1.0, 1.0, 1.0, 1.0];
    mouth.matrix.translate(-0.05, 0.75+flyVertical, 0.05);
    mouth.matrix.scale(0.1, 0.05, 0.05);
    mouth.render();

    // draw two legs, which should move up and down with time
    var leftLeg = new Cube([1.0, 0.0, 1.0, 1.0]);
    // leftLeg.color = [1.0, 0.0, 1.0, 1.0];
    leftLeg.matrix.translate(-0.2, -0.65+g_leftLegVertical+flyVertical, 0.15);
    var leftLegCoordsMat = new Matrix4(leftLeg.matrix);
    leftLeg.matrix.scale(0.15, 0.5, 0.15);
    leftLeg.render();

    var rightLeg = new Cube([1.0, 0.0, 1.0, 1.0]);
    // rightLeg.color = [1.0, 0.0, 1.0, 1.0];
    rightLeg.matrix.translate(0.05, -0.65+g_rightLegVertical+flyVertical, 0.15);
    var rightLegCoordsMat = new Matrix4(rightLeg.matrix);
    rightLeg.matrix.scale(0.15, 0.5, 0.15);
    rightLeg.render();

    // draw two feet
    var leftFoot = new Cube([0.6, 0.5, 0.6, 1.0]);
    // leftFoot.color = [0.6, 0.5, 0.6, 1.0];
    leftFoot.matrix = leftLegCoordsMat;
    leftFoot.matrix.translate(-0.025, -0.1, -0.15);
    leftFoot.matrix.scale(0.2, 0.1, 0.3);
    leftFoot.render();

    var rightFoot = new Cube([0.6, 0.5, 0.6, 1.0]);
    // rightFoot.color = [0.6, 0.5, 0.6, 1.0];
    rightFoot.matrix = rightLegCoordsMat;
    rightFoot.matrix.translate(-0.025, -0.1, -0.15);
    rightFoot.matrix.scale(0.2, 0.1, 0.3);
    rightFoot.render();

    // check time and show on webpage
    // how to fix ReferenceError: StartTime is not defined?

    var duration = performance.now() - StartTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");


}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get element with id: " + htmlID);
    return;
  }
  htmlElm.innerHTML = text;
}