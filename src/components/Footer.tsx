export function Footer() {
  return (
    <footer>
      <a href="#home">
        © <span id="year">{new Date().getFullYear()}</span> Sidali Saadi
      </a>
      <p>
        Landscape by{" "}
        <a
          href="https://github.com/LingDong-/shan-shui-inf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lingdong Huang ↗
        </a>
      </p>
      <a href="#home">Back to the top ↑</a>
    </footer>
  );
}
