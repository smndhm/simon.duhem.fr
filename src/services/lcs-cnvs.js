class LcsCnvs {
  constructor(window) {
    // Generative
    this.generative = {
      vertices: {
        limit: 50,
        list: [],
      },
      theme: {
        colors: ["#25CE7B", "#DA38B5", "#FDC741", "#01B3E3", "#FF6B01"],
        blendingMode: "multiply",
      },
      around: 50,
      polygons: [],
      underline: [],
      interval: null,
    };

    // Window
    this.window = window;

    this.window.addEventListener("resize", () => {
      this.setCanvasSize();
    });

    // Mouse mouve events
    ["mousemove", "touchmove"].forEach((eventType) => {
      this.window.addEventListener(
        eventType,
        (event) => {
          clearInterval(this.generative.interval);
          const vertex = {
            x: event.pageX || (event.touches && event.touches[0].pageX) || 0,
            y: event.pageY || (event.touches && event.touches[0].pageY) || 0,
          };
          this.addVertex(vertex);
          this.generative.interval = setInterval(() => {
            this.removeVertex();
          }, 10);
        },
        false
      );
    });

    // Document
    this.document = this.window.document;

    // Add event on links
    this.document.querySelectorAll("nav a").forEach((el) => {
      ["mouseover", "focusin"].forEach((eventType) => {
        el.addEventListener(eventType, (event) => {
          this.underline(event.target);
        });
      });
      ["mouseleave", "blur"].forEach((eventType) => {
        el.addEventListener(eventType, () => {
          this.generative.underline = [];
          this.clearCanvas();
        });
      });
    });

    // Canvas
    this.canvas = this.document.createElement("canvas");
    this.canvas.id = "lcs-cnvs";
    this.setCanvasSize();

    this.ctx = this.canvas.getContext("2d");

    // Append canvas to body
    this.document.addEventListener("DOMContentLoaded", () => {
      this.document.body.append(this.canvas);
    });
  }

  /**
   * Set canvas size
   */
  setCanvasSize() {
    this.canvas.width = this.window.innerWidth;
    this.canvas.height = this.window.innerHeight;
  }

  /**
   *
   * @param {*} min
   * @param {*} max
   */
  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   *
   * @param {*} vertexA
   * @param {*} vertexB
   */
  getVerticesDistance(vertexA, vertexB) {
    return Math.sqrt(
      Math.pow(vertexA.x - vertexB.x, 2) + Math.pow(vertexA.y - vertexB.y, 2)
    );
  }

  /**
   *
   * @param {*} array
   */
  getRandomArrayValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   *
   */
  updatePolygones() {
    this.generative.polygons = this.generative.polygons.filter((polygon) =>
      polygon.vertices.some((pVertex) =>
        this.generative.vertices.list.some(
          (vVertex) => pVertex.x === vVertex.x && pVertex.y === vVertex.y
        )
      )
    );
  }

  /**
   *
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   *
   * @param {*} ms
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   *
   * @param {*} vertices
   * @param {*} vertex
   * @param {*} count
   */
  getClosestVertices(vertices, vertex, count) {
    return vertices
      .sort((a, b) => {
        return (
          this.getVerticesDistance(a, vertex) -
          this.getVerticesDistance(b, vertex)
        );
      })
      .slice(0, count);
  }

  /**
   *
   * @param {number} delay
   */
  async drawPolygons(delay = 0) {
    const polygons = this.generative.polygons.concat(this.generative.underline);
    // Clear canvas
    this.clearCanvas();

    // Set blending mode
    if (this.generative.theme.blendingMode) {
      this.ctx.globalCompositeOperation = this.generative.theme.blendingMode;
    }

    // Add polygone
    for (const { vertices, color } of polygons) {
      this.ctx.beginPath();
      this.ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        this.ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
      this.ctx.fill();
      this.ctx.stroke();

      // Add delay
      if (delay) {
        await this.sleep(delay);
      }
    }

    // Clear if polygon list is empty
    if (!polygons.length) {
      this.clearCanvas();
    }
  }

  /**
   *
   * @param {object} position
   * @param {number} distance
   */
  getRandomVertex(position, distance) {
    let vertex;
    do {
      vertex = {
        x: this.getRandomNumberBetween(
          position.x - distance,
          position.x + distance
        ),
        y: this.getRandomNumberBetween(
          position.y - distance,
          position.y + distance
        ),
      };
    } while (this.getVerticesDistance(position, vertex) > distance);
    return vertex;
  }

  /**
   *
   * @param {*} position
   */
  addVertex(position) {
    const vertex = this.getRandomVertex(
      {
        x: position.x,
        y: position.y,
      },
      this.generative.around
    );

    if (this.generative.vertices.list.length >= 2) {
      const closestVertices = this.getClosestVertices(
        [...this.generative.vertices.list],
        vertex,
        2
      );
      this.generative.polygons.push({
        vertices: [vertex].concat(closestVertices),
        color: this.getRandomArrayValue(this.generative.theme.colors),
      });
    }

    this.generative.vertices.list.push(vertex);
    this.generative.vertices.list = this.generative.vertices.list.slice(
      -this.generative.vertices.limit
    );

    this.updatePolygones();

    this.drawPolygons();
  }

  /**
   *
   */
  removeVertex() {
    this.generative.vertices.list.shift();
    this.updatePolygones();
    this.drawPolygons();
    if (!this.generative.polygons.length) {
      clearInterval(this.generative.interval);
    }
  }

  /**
   *
   * @param {*} element
   */
  async underline(element) {
    this.generative.vertices.list = [];
    this.generative.polygons = [];
    // Init generative
    let vertices = [];

    // Get element position
    const bcr = element.getBoundingClientRect();
    const y = bcr.y + bcr.height;

    // Set polygons positions
    for (let pos = bcr.x; pos <= bcr.x + bcr.width; pos += 10) {
      // Set vertex
      const vertex = {
        x: pos,
        y: this.getRandomNumberBetween(y, y + 10),
      };

      // Create polygon
      if (vertices.length >= 2) {
        const closestVertices = this.getClosestVertices(
          [...vertices],
          vertex,
          2
        );
        this.generative.underline.push({
          vertices: [vertex].concat(closestVertices),
          color: this.getRandomArrayValue(this.generative.theme.colors),
        });
      }

      // Add vertex to list
      vertices.push(vertex);
    }

    // Draw
    this.drawPolygons(20);
  }
}

export default LcsCnvs;
