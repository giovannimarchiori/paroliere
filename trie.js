class TrieNode {
  constructor() {
    this.c = {};
    this.e = 0;
  }
}

class Trie {
  constructor() {
    this.r = new TrieNode();
  }

  insert(w) {
    let n = this.r;
    for (let ch of w) {
      if (!n.c[ch]) n.c[ch] = new TrieNode();
      n = n.c[ch];
    }
    n.e = 1;
  }

  isWord(w) {
    let n = this.r;
    for (let ch of w) {
      if (!n.c[ch]) return false;
      n = n.c[ch];
    }
    return n.e === 1;
  }

  isPrefix(p) {
    let n = this.r;
    for (let ch of p) {
      if (!n.c[ch]) return false;
      n = n.c[ch];
    }
    return true;
  }
}
