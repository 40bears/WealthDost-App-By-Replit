import React from "react";
import { useFlow } from "./FlowMachine";

type FlowRouteElement = React.ReactElement<{ name: string; element?: React.ReactNode }>;

export function FlowRoutes({ children }: { children: FlowRouteElement | FlowRouteElement[] }) {
  const { state } = useFlow();

  const arr = React.Children.toArray(children) as FlowRouteElement[];
  const match = arr.find((child) => child.props.name === state);

  if (!match) return null;
  return match.props.element ?? match;
}

