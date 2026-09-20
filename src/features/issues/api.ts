export type Issue = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  author: string;
};
