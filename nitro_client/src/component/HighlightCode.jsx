const HighlightCode = (code, ext) => {
  if (!code) return "";

  let highlighted = code;

  // comments
  highlighted = highlighted
    .replace(/(\/\/.*)/g, `<span class="comment">$1</span>`) // JS comments
    .replace(/(#.*)/g, `<span class="comment">$1</span>`) // Python comments
    .replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="comment">$1</span>`); // multi-line comments

  // strings
  highlighted = highlighted.replace(
    /(".*?"|'.*?'|`.*?`)/g,
    `<span class="string">$1</span>`
  );

  // numbers
  highlighted = highlighted.replace(
    /\b([0-9]+)\b/g,
    `<span class="number">$1</span>`
  );

  // language-specific keywords
  if ([".py"].includes(ext)) {
    highlighted = highlighted.replace(
      /\b(def|class|return|if|else|elif|for|while|import|from|as|try|except|with|lambda|yield|True|False|None)\b/g,
      `<span class="keyword">$1</span>`
    );
  } else {
    highlighted = highlighted.replace(
      /\b(const|let|var|function|return|if|else|for|while|import|from|export|class|extends|new|async|await|try|catch)\b/g,
      `<span class="keyword">$1</span>`
    );
  }

  return highlighted;
};


export default  HighlightCode