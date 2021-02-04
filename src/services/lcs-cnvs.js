class LcsCnvs {
  constructor(window) {
    this.around = 50;
    this.vertices = {
      limit: 50,
      list: [],
      themes: [
        {
          colors: [
            "#f72585",
            "#b5179e",
            "#7209b7",
            "#560bad",
            "#480ca8",
            "#3a0ca3",
            "#3f37c9",
            "#4361ee",
            "#4895ef",
            "#4cc9f0",
          ],
        },
      ],
    };
    this.polygons = [];

    this.window = window;

    this.window.onresize = () => {
      this.canvas.width = this.window.innerWidth;
      this.canvas.height = this.window.innerHeight;
    };

    let interval;

    ["mousemove", "touchmove"].forEach((eventType) => {
      this.window.addEventListener(
        eventType,
        (event) => {
          clearInterval(interval);
          const vertex = {
            x: event.pageX || (event.touches && event.touches[0].pageX) || 0,
            y: event.pageY || (event.touches && event.touches[0].pageY) || 0,
          };
          this.addVertex(vertex);
          interval = setInterval(() => {
            this.addVertex(vertex);
          }, 10);
        },
        false
      );
    });

    this.document = this.window.document;

    this.canvas = this.document.createElement("canvas");
    this.canvas.width = this.window.innerWidth;
    this.canvas.height = this.window.innerHeight;
    this.canvas.id = "lcs-cnvs";

    this.ctx = this.canvas.getContext("2d");
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
   * @param {*} area
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
   * @param {*} array
   */
  getRandomArrayValue(array) {
    return array[Math.floor(Math.random() * array.length)];
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
      this.around
    );

    if (this.vertices.list.length >= 2) {
      const closestVertices = this.getClosestVertices(
        [...this.vertices.list],
        vertex,
        2
      );
      this.polygons.push({
        vertices: [vertex].concat(closestVertices),
        color: this.getRandomArrayValue(this.vertices.themes[0].colors),
      });
    }

    this.vertices.list.push(vertex);
    this.vertices.list = this.vertices.list.slice(-this.vertices.limit);

    this.polygons = this.polygons.filter((polygon) =>
      polygon.vertices.some((pVertex) =>
        this.vertices.list.some(
          (vVertex) => pVertex.x === vVertex.x && pVertex.y === vVertex.y
        )
      )
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const { vertices, color } of this.polygons) {
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
    }

    this.document.body.append(this.canvas);
  }
}

export default LcsCnvs;
