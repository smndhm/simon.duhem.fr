class LcsCnvs {
  constructor(window) {
    const nbVertices = 50;
    this.window = window;
    this.document = this.window.document;

    this.canvas = this.document.createElement("canvas");
    this.canvas.width = this.window.innerWidth;
    this.canvas.height = this.window.innerHeight;
    this.canvas.id = "lcs-cnvs";

    this.ctx = this.canvas.getContext("2d");

    // this.window.addEventListener(
    //     "mousemove",
    //     (event) => {
    //         console.log({ x: event.pageX, y: event.pageY });
    //     },
    //     false
    // );
    //const verticesLimit = 50;
    let vertices = [];
    let polygons = [];

    setInterval(() => {
      const vertex = this.getRandomVertex([
        {
          x: 0,
          y: 0,
        },
        {
          x: this.canvas.width,
          y: this.canvas.height,
        },
      ]);

      if (vertices.length >= 2) {
        const closestVertices = this.getClosestVertices(
          [...vertices],
          vertex,
          2
        );
        polygons.push([vertex].concat(closestVertices));
      }

      vertices.push(vertex);
      vertices = vertices.slice(-nbVertices);

      polygons = polygons.filter((polygon) =>
        polygon.some((pVertex) =>
          vertices.some(
            (vVertex) => pVertex.x === vVertex.x && pVertex.y === vVertex.y
          )
        )
      );

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (const vertices of polygons) {
        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          this.ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }, 50);

    this.document.body.append(this.canvas);
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
  getRandomVertex(area) {
    return {
      x: this.getRandomNumberBetween(area[0].x, area[1].x),
      y: this.getRandomNumberBetween(area[0].y, area[1].y),
    };
  }

  /**
   *
   * @param {*} vertexA
   * @param {*} vertexB
   */
  getVerticesDistance(vertexA, vertexB) {
    return (
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
}

export default LcsCnvs;
