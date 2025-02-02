"use client";
import Link from "next/link";
import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

const style = {
  base: "px-6 rounded-full text-xl md:text-2xl font-bold py-3 h-fit break-keep",
  color: {
    yellow:
      "bg-[#FFCA73] text-[#462002] shadow-[0px_5px_8px_0px_#FFBA474D] hover:bg-[#e3b364] active:bg-[#cca15a]",
    blue: "bg-[#385AAC] text-[#F8F3E8] shadow-[0px_6px_6px_0px_#5D7DDB4D] hover:bg-[#304e96] active:bg-[#263d75]",
    gray: "bg-[#808080] text-[#FFFFFF] shadow-[0px_6px_6px_0px_#8080804D]",
  },
};

type Style = {
  [key in keyof Omit<typeof style, "base">]: keyof (typeof style)[key];
};

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  url?: never;
};

type LinkProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: never;
  url: string;
};

type Props = (ButtonProps | LinkProps) & Style;

export default function Button({
  children,
  color,
  onClick,
  url,
  className,
}: Props) {
  if (onClick) {
    return (
      <ClickButton color={color} onClick={onClick} className={className}>
        {children}
      </ClickButton>
    );
  }
  if (url) {
    return (
      <LinkButton color={color} url={url} className={className}>
        {children}
      </LinkButton>
    );
  }
  return <ClickButton color={color}>{children}</ClickButton>;
}

function ClickButton({
  children,
  onClick,
  color,
  className,
}: ButtonProps & Style) {
  return (
    <button
      onClick={onClick}
      className={twMerge(style.base, style.color[color], className)}
    >
      {children}
    </button>
  );
}

function LinkButton({ children, url, color, className }: LinkProps & Style) {
  const isExternal = url[0] !== "/";
  return (
    <Link
      className={twMerge(
        style.base,
        style.color[color],
        "flex items-center justify-center",
        className,
      )}
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}
