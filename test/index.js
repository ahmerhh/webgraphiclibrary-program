// main.js
import Test from 'tape';
import { getWebGLContext } from '@ahmerhh/WebGraphicLibrary-context';
import Program from '../src/Program';

const canvas = document.createElement('canvas');
const gl = getWebGLContext(canvas);

const vertexShaderSource = `
  attribute vec3 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform vec4 uColor;

  void main() {
    gl_FragColor = uColor;
  }
`;

Test('Program class', t => {
  t.test('should be instanciable', t => {
    t.plan(1);

    const program = new Program(gl, vertexShaderSource, fragmentShaderSource);

    t.ok(program instanceof Program, 'instance of Program');
  });

  t.test('should accept attributes', t => {
    t.plan(1);

    const program = new Program(gl, vertexShaderSource, fragmentShaderSource);
    program.addAttribute('aPosition', 3, gl.FLOAT);

    const attributesCount = gl.getProgramParameter(program.program, gl.ACTIVE_ATTRIBUTES);

    t.equal(attributesCount, 1, '1 active attribute');
  });

  t.test('should accept uniforms', t => {
    t.plan(1);

    const program = new Program(gl, vertexShaderSource, fragmentShaderSource);
    program.addUniform('uColor', gl.FLOAT_VEC4);

    const uniformsCount = gl.getProgramParameter(program.program, gl.ACTIVE_UNIFORMS);

    t.equal(uniformsCount, 1, '1 active uniform');
  });

  t.test('should set active program when binded', t => {
    t.plan(1);

    const program = new Program(gl, vertexShaderSource, fragmentShaderSource);
    program.bind();

    t.equal(gl.getParameter(gl.CURRENT_PROGRAM), program.program, 'program is active');
  });

  t.test('should be disposable', t => {
    t.plan(1);

    const program = new Program(gl, vertexShaderSource, fragmentShaderSource);
    program.dispose();

    t.equal(program.program, null, 'program deleted');
  });

  t.onFinish(window.close.bind(window));
});

// Program.js
class Program {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
      this.gl = gl;
      this.program = null;
  
      this.init(vertexShaderSource, fragmentShaderSource);
    }
  
    init(vertexShaderSource, fragmentShaderSource) {
      const gl = this.gl;
      const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  
      this.program = this.createProgram(vertexShader, fragmentShader);
    }
  
    createShader(type, source) {
      const gl = this.gl;
      const shader = gl.createShader(type);
  
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
  
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(shader));
      }
  
      return shader;
    }
  
    createProgram(vertexShader, fragmentShader) {
      const gl = this.gl;
      const program = gl.createProgram();
  
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
  
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      }
  
      return program;
    }
  
    bind() {
      const gl = this.gl;
      gl.useProgram(this.program);
    }
  
    addAttribute(name, size, type) {
      const gl = this.gl;
      const attributeLocation = gl.getAttribLocation(this.program, name);
  
      if (attributeLocation >= 0) {
        gl.vertexAttribPointer(attributeLocation, size, type, false, 0, 0);
        gl.enableVertexAttribArray(attributeLocation);
      }
    }
  
    addUniform(name, type) {
      const gl = this.gl;
      const uniformLocation = gl.getUniformLocation(this.program, name);
  
      if (uniformLocation !== null) {
        // Example: gl.uniform4f(uniformLocation, 1.0, 0.0, 0.0, 1.0);
        // You can set uniform values as needed based on the type.
      }
    }
  
    dispose() {
      const gl = this.gl;
      gl.deleteProgram(this.program);
      this.program = null;
    }
  }
  
  export default Program;
  