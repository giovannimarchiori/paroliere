function solveBoard(gridLetters, trie) {
  const results = new Set();

  function dfs(i, visited, word) {
    if (visited.has(i)) return;

    word += gridLetters[i];

    if (!trie.isPrefix(word)) return;

    if (word.length >= 3 && trie.isWord(word)) {
      results.add(word);
    }

    visited.add(i);

    const x = i % 4;
    const y = Math.floor(i / 4);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        const ni = ny * 4 + nx;

        if (nx >= 0 && ny >= 0 && nx < 4 && ny < 4) {
          dfs(ni, new Set(visited), word);
        }
      }
    }
  }

  for (let i = 0; i < 16; i++) {
    dfs(i, new Set(), "");
  }

  return Array.from(results).sort();
}
