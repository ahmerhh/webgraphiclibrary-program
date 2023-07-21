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
