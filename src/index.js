import Shader from '@ahmerhh/WebGraphicLibrary-shader';

/**
 * @class Program
 */
export default class Program {
  /**
   * @constructs Program
   * @param {WebGLRenderingContext} gl
   * @param {Shader|string} vertex - vertex shader
   * @param {Shader|string} fragment - fragment shader
   */
  constructor(gl, vertex, fragment) {
    this.gl = gl;

    // If the vertex parameter is a string, create a new Shader instance with the vertex shader source
    if (typeof vertex === 'string') {
      vertex = new Shader(this.gl, this.gl.VERTEX_SHADER, vertex);
    }

    // If the fragment parameter is a string, create a new Shader instance with the fragment shader source
    if (typeof fragment === 'string') {
      fragment = new Shader(this.gl, this.gl.FRAGMENT_SHADER, fragment);
    }

    this.vertexShader = vertex;
    this.fragmentShader = fragment;

    // Create the WebGL program
    this.program = this.gl.createProgram();

    // Attach the vertex and fragment shaders to the program
    this.gl.attachShader(this.program, this.vertexShader.shader);
    this.gl.attachShader(this.program, this.fragmentShader.shader);

    // Link the program
    this.gl.linkProgram(this.program);

    // Check if program linking was successful
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error('Error while linking program');
    }

    // Create empty objects to store attributes and uniforms information
    this._attributes = {};
    this._uniforms = {};
  }

  /**
   * @method addAttribute
   * @public
   * @param {string} name
   * @param {uint} size
   * @param {uint} type
   */
  addAttribute(name, size, type) {
    const location = this.gl.getAttribLocation(this.program, name);

    this._attributes[name] = {
      location,
      type,
      size,
    };

    // Enable the attribute location
    this.gl.enableVertexAttribArray(location);
  }

  /**
   * @method setAttributePointer
   * @public
   * @param {string} name
   */
  setAttributePointer(name) {
    const { location, size, type } = this._attributes[name];

    // Set the vertex attribute pointer
    this.gl.vertexAttribPointer(location, size, type, false, 0, 0);
  }

  /**
   * @method addUniform
   * @public
   * @param {string} name
   * @param {uint} type
   */
  addUniform(name, type) {
    const location = this.gl.getUniformLocation(this.program, name);

    this._uniforms[name] = {
      location,
      type,
    };
  }

  /**
   * @method setUniform
   * @public
   * @param {string} name
   * @param {any} value
   */
  setUniform(name, value) {
    const { location, type } = this._uniforms[name];

    // Set the uniform value based on its type
    switch (type) {
      case this.gl.INT:
        this.gl.uniform1i(location, value);
        break;
      case this.gl.INT_VEC2:
        this.gl.uniform2iv(location, value);
        break;
      case this.gl.INT_VEC3:
        this.gl.uniform3iv(location, value);
        break;
      case this.gl.INT_VEC4:
        this.gl.uniform4iv(location, value);
        break;
      case this.gl.FLOAT:
        this.gl.uniform1f(location, value);
        break;
      case this.gl.FLOAT_VEC2:
        this.gl.uniform2fv(location, value);
        break;
      case this.gl.FLOAT_VEC3:
        this.gl.uniform3fv(location, value);
        break;
      case this.gl.FLOAT_VEC4:
        this.gl.uniform4fv(location, value);
        break;
      case this.gl.FLOAT_MAT2:
        this.gl.uniformMatrix2fv(location, false, value);
        break;
      case this.gl.FLOAT_MAT3:
        this.gl.uniformMatrix3fv(location, false, value);
        break;
      case this.gl.FLOAT_MAT4:
        this.gl.uniformMatrix4fv(location, false, value);
        break;
    }
  }

  /**
   * @method bind
   * @public
   */
  bind() {
    this.gl.useProgram(this.program);
  }

  /**
   * @method dispose
   * @public
   */
  dispose() {
    this.gl.deleteProgram(this.program);
    this.program = null;

    // Dispose the vertex and fragment shaders
    this.vertexShader.dispose();
    this.fragmentShader.dispose();
  }
}
