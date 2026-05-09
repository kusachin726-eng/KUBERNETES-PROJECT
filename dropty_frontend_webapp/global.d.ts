// Allow importing plain CSS files (global and module formats)
// Prevents TS error: "Cannot find module or type declarations for side-effect import of './globals.css'" 

declare module "*.css";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.scss";

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
