class Cube{
  constructor(color=null){
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    if(color){
      this.color = color;
    }
    // this.size = 5.0;
    // this.segments = 10;
    this.matrix = new Matrix4();

    this.buffer = null;
  }

  render(){
    // var xy = this.position;
    var rgba = this.color;
    // var size = this.size;
  
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


  

		drawTriangle3D( [0,0,0,   1,1,0,   1,0,0] );
		drawTriangle3D( [0,0,0,   1,1,0,   0,1,0] );
    
    let num = 0.9;
    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);

		drawTriangle3D( [0,1,0,   1,1,1,   0,1,1] );
		drawTriangle3D( [0,1,0,   1,1,1,   1,1,0] );


    num = 0.4;
    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);

    drawTriangle3D( [0,1,1,   0,0,0,   0,1,0] );
    drawTriangle3D( [0,1,1,   0,0,0,   0,0,1] );


    num = 0.8;
    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);

    drawTriangle3D( [1,0,1,   1,1,0,   1,0,0] );
    drawTriangle3D( [1,0,1,   1,1,0,   1,1,1] );


    num = 0.7;
    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);

    drawTriangle3D( [1,0,1,   0,0,0,   1,0,0] );
    drawTriangle3D( [1,0,1,   0,0,0,   0,0,1] );


    num = 0.6;
    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);

    drawTriangle3D( [1,0,1,   0,1,1,   1,1,1] );
    drawTriangle3D( [1,0,1,   0,1,1,   0,0,1] );

  }

}

