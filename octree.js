var octree = (() => {
  var mod = {};

  class Color {
    static isTransparent(hex) {
      return (hex & 0xff) === 0;
    }
    static diff(x, y) {
      const r = x.R - y.R,
        g = x.G - y.G,
        b = x.B - y.B;
      return 3 * r * r + 6 * g * g + b * b;
    }
    static encode(a) {
      return (a.R << 0o30) | (a.G << 0o20) | (a.B << 0o10) | 0xff;
    }
    constructor(hex) {
      this.R = (hex >>> 0o30) & 0xff;
      this.G = (hex >>> 0o20) & 0xff;
      this.B = (hex >>> 0o10) & 0xff;
    }
    index(level) {
      const mask = 0b10000000 >>> level;
      let index = 0;
      if (this.R & mask) index |= 0b100;
      if (this.G & mask) index |= 0b010;
      if (this.B & mask) index |= 0b001;
      return index;
    }
  }

  mod.Color = Color;

  class Node {
    constructor() {
      this.R = this.G = this.B = this.pixelCount = this.error = 0;
      this.isLeaf = false;
      this.children = new Array(8);
    }
    addColor(color) {
      this.R += color.R;
      this.G += color.G;
      this.B += color.B;
      this.pixelCount++;
    }
    reduce() {
      let deleted = 0;
      for (let i = 0, child; i < 8; ++i) {
        child = this.children[i];
        if (child) {
          if (!child.isLeaf) deleted += child.reduce();
          this.children[i] = undefined;
          deleted++;
        }
      }
      this.isLeaf = true;
      return Math.max(0, deleted - 1);
    }
  }

  mod.Node = Node;

  class Octree {
    constructor() {
      this.leavesCount = 0;
      this.root = new Node();
    }

    push(hex) {
      if (Color.isTransparent(hex)) return;
      const color = new Color(hex);
      for (let j = 0, node = this.root, k, child; j <= 8; ++j) {
        node.addColor(color);
        if (j === 8) continue;
        k = color.index(j);
        child = node.children[k];
        if (child === undefined) {
          node.children[k] = child = new Node();
          if (j + 1 === 8) {
            child.isLeaf = true;
            this.leavesCount++;
          }
        }
        node = child;
      }
    }

    computeError(node) {
      for (let i = 0, child; i < 8; ++i) {
        child = node.children[i];
        if (child) {
          node.error += Color.diff(node, child);
          if (!child.isLeaf) this.computeError(child);
        }
      }
    }

    flatten(node, into) {
      into.push(node);
      for (let i = 0, child; i < 8; ++i) {
        child = node.children[i];
        if (child && !child.isLeaf) {
          this.flatten(child, into);
        }
      }
    }

    leaves(node, into) {
      if (node.isLeaf) into.push(node);
      else {
        for (let i = 0, child; i < 8; ++i) {
          child = node.children[i];
          if (child) this.leaves(child, into);
        }
      }
    }

    get(maxColors = 256) {
      this.computeError(this.root);

      const nodes = [];
      this.flatten(this.root, nodes);
      nodes.sort((a, b) => b.error - a.error || a.pixelCount - b.pixelCount);

      for (let node; this.leavesCount > maxColors; ) {
        node = nodes.pop();
        if (node.isLeaf) continue;
        this.leavesCount -= node.reduce();
      }

      const palette = [];
      this.leaves(this.root, palette);
      palette.sort((a, b) => b.pixelCount - a.pixelCount || a.error - b.error);
      palette.forEach((p) => {
        p.R /= p.pixelCount;
        p.G /= p.pixelCount;
        p.B /= p.pixelCount;
      });

      return palette;
    }
  }

  mod.Octree = Octree;

  function gen(pixels, width, height, maxColors) {
    const tree = new Octree();

    for (let i = 0, len = width * height; i < len; ++i) {
      const hex = pixels.getUint32(i << 2);
      if (Color.isTransparent(hex)) continue;
      tree.push(hex);
    }

    return tree.get(maxColors);
  }

  mod.gen = gen;

  return mod;
})();
