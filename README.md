# GL Program

WebGL program wrapper.

## Installation

```sh
$ npm install --save @ahmerhh/WebGraphicLibrary-program
```

## Usage

```js
import Program from '@ahmerhh/WebGraphicLibrary-program';

// Setup canvas, WebGL context, and buffers

// Create a new program instance
const program = new Program(gl,
  `
  attribute vec3 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 1.0);
  }
  `,
  `
  uniform vec3 uColor;

  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
  `
);

// Add attributes to the program
program.addAttribute('aPosition', 3, gl.FLOAT);

// Add uniform to the program
program.addUniform('uColor', gl.FLOAT_VEC3);

// Bind the attribute pointer to the current active buffer
vertsBuffer.bind();
program.setAttributePointer('aPosition');

// Set uniform value
program.setUniform('uColor', [1, 0, 0]);
```

## API

#### `program = new Program(gl, vertex, fragment)`

Create a new program, where:
- `gl` is the [WebGL context](https://github.com/ahmerhh/WebGraphicLibrary-context).
- `vertex` is the vertex shader. It can either be a [`Shader`](https://github.com/ahmerhh/WebGraphicLibrary-shader) instance or a `string`.
- `fragment` is the fragment shader. It can either be a [`Shader`](https://github.com/ahmerhh/WebGraphicLibrary-shader) instance or a `string`.

#### `program.addAttribute(name, size, type)`

Add a new attribute to the program. Size is usually `2` (vec2) or `3` (vec3), and type `gl.FLOAT`.

#### `program.setAttributePointer(name)`

Set the attribut pointer to the current active buffer.

#### `program.addUniform(name, type)`

Add a new uniform where the type can be:
- `gl.INT`
- `gl.INT_VEC2`
- `gl.INT_VEC3`
- `gl.INT_VEC4`
- `gl.FLOAT`
- `gl.FLOAT_VEC2`
- `gl.FLOAT_VEC3`
- `gl.FLOAT_VEC4`
- `gl.FLOAT_MAT2`
- `gl.FLOAT_MAT3`
- `gl.FLOAT_MAT4`

#### `program.setUniform(name, value)`

Set uniform value.

#### `program.bind()`

Make this program the active one. Calls `gl.useProgram()`.

#### `program.dispose()`

Delete instance. Calls `gl.deleteProgram()`.

## License

MIT, see [LICENSE.md](https://github.com/ahmerhh/gl-program/blob/master/LICENSE.md) for more details.

## Credits

Thanks to the amazing [stackgl](http://stack.gl/) for the inspiration.