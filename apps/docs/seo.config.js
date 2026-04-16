const seoConfig = {
  metadataBase: new URL("https://mocha.embrly.ca"),
  title: {
    template: "Mocha",
    default:
      "Mocha — Modern Open Source Issue Management & Helpdesk",
  },
  description:
    "Mocha is a modern, self-hosted issue tracker and helpdesk. An open-source alternative to Jira and Zendesk. Deploy in minutes, own your data forever.",
  themeColor: "#0A0A0A",
  openGraph: {
    images: "/og-image.png",
    url: "https://mocha.embrly.ca",
  },
  manifest: "/site.webmanifest",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "mask-icon", url: "/favicon.ico" },
    { rel: "image/x-icon", url: "/favicon.ico" },
  ],
  twitter: {
    site: "@embrly",
    creator: "@embrly",
  },
};

export default seoConfig;