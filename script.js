document.addEventListener('DOMContentLoaded', () => {
  const compareButton = document.querySelector('.js-compare-button');
  const resultContainer = document.querySelector('.js-result-container');
  const textInputs = document.querySelectorAll('.js-text-input');

  compareButton.addEventListener('click', () => {
      const text1 = textInputs[0].value;
      const text2 = textInputs[1].value;
      const diff = simpleDiff(text1, text2);
      displayDiff(diff);
  });

  function simpleDiff(text1, text2) {
      const lines1 = text1.split('\n');
      const lines2 = text2.split('\n');
      const lcs = longestCommonSubsequence(lines1, lines2);
      const diff = [];
      let i = 0, j = 0, k = 0;

      while (i < lines1.length || j < lines2.length) {
          if (k < lcs.length && lines1[i] === lcs[k] && lines2[j] === lcs[k]) {
              diff.push({ type: 'unchanged', left: lines1[i], right: lines2[j] });
              i++; j++; k++;
          } else if (j < lines2.length && (k === lcs.length || lines2[j] !== lcs[k])) {
              diff.push({ type: 'added', left: null, right: lines2[j] });
              j++;
          } else if (i < lines1.length && (k === lcs.length || lines1[i] !== lcs[k])) {
              diff.push({ type: 'removed', left: lines1[i], right: null });
              i++;
          }
      }

      return diff;
  }

  function longestCommonSubsequence(seq1, seq2) {
      const m = seq1.length;
      const n = seq2.length;
      const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

      for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
              if (seq1[i - 1] === seq2[j - 1]) {
                  dp[i][j] = dp[i - 1][j - 1] + 1;
              } else {
                  dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
              }
          }
      }

      const lcs = [];
      let i = m, j = n;
      while (i > 0 && j > 0) {
          if (seq1[i - 1] === seq2[j - 1]) {
              lcs.unshift(seq1[i - 1]);
              i--; j--;
          } else if (dp[i - 1][j] > dp[i][j - 1]) {
              i--;
          } else {
              j--;
          }
      }

      return lcs;
  }

  function displayDiff(diff) {
      resultContainer.innerHTML = '';
      const leftColumn = document.createElement('div');
      const rightColumn = document.createElement('div');
      leftColumn.className = 'diff-column left-column';
      rightColumn.className = 'diff-column right-column';

      let leftLineNumber = 1;
      let rightLineNumber = 1;

      diff.forEach(line => {
          const leftLine = document.createElement('div');
          const rightLine = document.createElement('div');
          leftLine.className = 'diff-line';
          rightLine.className = 'diff-line';

          if (line.left !== null) {
              leftLine.innerHTML = `<span class="line-number">${leftLineNumber}</span>${escapeHtml(line.left)}`;
              leftLineNumber++;
          } else {
              leftLine.innerHTML = '<span class="line-number"></span>';
          }

          if (line.right !== null) {
              rightLine.innerHTML = `<span class="line-number">${rightLineNumber}</span>${escapeHtml(line.right)}`;
              rightLineNumber++;
          } else {
              rightLine.innerHTML = '<span class="line-number"></span>';
          }

          if (line.type === 'added') {
              rightLine.classList.add('added');
          } else if (line.type === 'removed') {
              leftLine.classList.add('removed');
          }

          leftColumn.appendChild(leftLine);
          rightColumn.appendChild(rightLine);
      });

      resultContainer.appendChild(leftColumn);
      resultContainer.appendChild(rightColumn);
  }

  function escapeHtml(unsafe) {
      return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
  }
});
