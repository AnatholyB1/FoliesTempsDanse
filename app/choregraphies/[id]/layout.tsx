"use client";
import {ChoregraphieDetailProvider} from "./chore-provider";

type Props = { params: Promise<{ id: string }>, children: React.ReactNode };

export default function ChoregraphieLayout({ children, params }: Props) {
  return (
    <ChoregraphieDetailProvider params={params}>
      {children}
    </ChoregraphieDetailProvider>
  );
}