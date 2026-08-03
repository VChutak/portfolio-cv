export type ColorSwatch = {
  label: string;
  hex: string;
  textClass?: string;
};

export type FlowStep = {
  title: string;
  description: string;
  calloutLabel?: string;
  calloutText?: string;
};

export type Hotspot = {
  number: number | string;
  top: string;
  left: string;
  text: string;
  align: "left" | "right" | "center";
};
