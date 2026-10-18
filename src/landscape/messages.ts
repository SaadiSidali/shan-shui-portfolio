export type LandscapeRequest =
  | {
      type: "init";
      seed: number;
      generatorUrl: string;
      width: number;
      scale: number;
      revision: number;
    }
  | {
      type: "resize";
      x: number;
      width: number;
      scale: number;
      revision: number;
    }
  | { type: "view"; x: number };

export type LandscapeResponse =
  | { type: "tile"; index: number; revision: number; svg: Blob }
  | { type: "error"; message: string };
