class Fox{
  constructor(){
    this.type = 'Fox';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
    // var xy = this.position;
    // var rgba = this.color;
    // var size = this.size;
    // var color = this.color;
  
    // Pass the position of a point to a_Position variable
    // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
    // gl.uniform1f(u_Size, size);

    // gl.drawArrays(gl.POINTS, 0, 1);

    // draw
    var triangleList = [
      [0,0,0,5,2,5],
      [0,0,0,5,-2,5],
      [0,5,0,6,2,5],
      [0,5,0,6,-2,5],
      [0,6,2,5,2.375,5.5],
      [0,6,-2,5,-2.375,5.5],
      [3.3,6.2,3.1,6.46,2,5],
      [-3.3,6.2,-3.1,6.46,-2,5],
      [3.3,6.2,3.1,6.46,3.5,7],
      [-3.3,6.2,-3.1,6.46,-3.5,7],
      [2.75,4,2,5,3.3,6.2],
      [-2.75,4,-2,5,-3.3,6.2],
      [2.75,4,3.5,4.5,3.5,7],
      [-2.75,4,-3.5,4.5,-3.5,7],
      [2.75,4,0,0,2,5],
      [-2.75,4,0,0,-2,5],
      [1.6,4,1.13,3.63,1.2,3],
      [-1.6,4,-1.13,3.63,-1.2,3],
      [1.6,4,1.65,3.3,1.2,3],
      [-1.6,4,-1.65,3.3,-1.2,3],
      [0,1,0.2,0.5,-0.2,0.5],
      [0,0,0.2,0.5,-0.2,0.5]

      


    ]

    const ORANGE = [1.0, 0.549, 0.0, 1.0];
    const LIGHT_ORANGE = [1.0, 0.65, 0.0, 1.0];
    const WHITE = [1.0, 1.0, 1.0, 1.0];
    const BLACK = [0.2, 0.2, 0.2, 1.0];
    const DARK_ORANGE = [0.8, 0.4, 0.0, 1.0];
    const GREY = [0.5, 0.5, 0.5, 1.0];
    const BROWN = [0.3, 0.1, 0.0, 1.0];
    var colors = [
      ORANGE,
      LIGHT_ORANGE,

      DARK_ORANGE,
      ORANGE,
      ORANGE,
      DARK_ORANGE,

      LIGHT_ORANGE,
      DARK_ORANGE,
      BLACK,
      BLACK,
      ORANGE,
      ORANGE,
      WHITE,
      WHITE,

      DARK_ORANGE,
      DARK_ORANGE,

      BROWN,
      BROWN,
      WHITE,
      WHITE,

      BROWN,
      BROWN
    ]

    var len = triangleList.length;

    for (var i = 0; i < len; i++){
      // var vertices = triangleList[i];
      // var color = colors[i];
      // drawTri(vertices, color);
      var div = 7.0;
      this.color = colors[i];
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      var curTri = [triangleList[i][0]/div, triangleList[i][1]/div, triangleList[i][2]/div, 
      triangleList[i][3]/div, triangleList[i][4]/div, triangleList[i][5]/div];
      drawTriangle(curTri);
      
    }
  }

  //  drawTri(vertices, color) {
  //   // Triangle class has function drawTriangle(vertices)
  //   // Want to figure out how to add color to the triangle
  //   this.color = color;
  //   drawTriangle(vertices);

    
  // }

}

