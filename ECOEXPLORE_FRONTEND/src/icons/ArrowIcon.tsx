import { ICON_DEFAULTS } from '@/constants/iconsDefaults';
import type IconProps from '@/interfaces/IconProps';

export default function ArrowIcon({
  width = ICON_DEFAULTS.width,
  height = ICON_DEFAULTS.height,
  strokeWidth,
  color = 'currentColor',
  colorStroke = 'none',
  className = '',
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={color}
      stroke={colorStroke}
      strokeWidth={strokeWidth}
      viewBox={`${ICON_DEFAULTS.viewBox}`}
      className={className}
      {...props}
    >
      <path d="m12 13.171 4.95-4.95 1.414 1.415L12 16 5.636 9.636 7.05 8.222l4.95 4.95Z" />
    </svg>
  );
}
