import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
//   defaultShowCopyCode: true,
//   flexsearch: {
//     codeblocks: true,
//   },
//   codeHighlight: true,
});

export default withNextra({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
