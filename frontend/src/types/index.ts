import { CSSProperties, ReactNode } from 'react';

export interface BrandItem {
  id: string;
  name: string;
  style: CSSProperties;
}

export interface BackerItem {
  id: string;
  name: string;
  style: CSSProperties;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface InfoCardProps {
  id: string;
  title: string;
  description: string;
  bgType: 'image' | 'solid';
  bgImage?: string;
  bgColor?: string;
  colSpan?: string;
  textColor?: string;
  descColor?: string;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  size?: 'default' | 'lg';
  withArrow?: boolean;
}
