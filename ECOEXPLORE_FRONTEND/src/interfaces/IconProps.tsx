import React from 'react';
/**
 *  Interface that defines the necessary properties for an icon component.
 *
 * @property {string | number} [width] - The width of the icon (e.g. "4rem", "100%", 48, etc.).
 * @property {string | number} [height] - The height of the icon (e.g. "auto", "50%", 32, etc.).
 * @property {number} [strokeWidth] - The width of the stroke of the icon.
 * @property {string} [color] - The fill color of the icon. Usually “currentColor” is used to inherit.
 * @property {string} [colorStroke] - The stroke (outline) color of the icon.
 * @property {string} [className] - The aditional CSS classes of the icon.
 */
export default interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  strokeWidth?: number | string;
  color?: string;
  colorStroke?: string;
  className?: string;
}
