import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type StateValue = string;
type EventValue = string;

export type FlowConfig = {
  initial: StateValue;
  transitions: Record<StateValue, Record<EventValue, StateValue>>;
};

type FlowContextValue = {
  state: StateValue;
  send: (event: EventValue) => void;
  go: (state: StateValue) => void;
  can: (event: EventValue) => boolean;
};

const FlowContext = createContext<FlowContextValue | null>(null);

export function useFlowMachine(config: FlowConfig) {
  const [state, setState] = useState<StateValue>(config.initial);

  const can = useCallback((event: EventValue) => {
    const next = config.transitions[state]?.[event];
    return Boolean(next);
  }, [config.transitions, state]);

  const send = useCallback((event: EventValue) => {
    const next = config.transitions[state]?.[event];
    if (next) setState(next);
  }, [config.transitions, state]);

  const go = useCallback((next: StateValue) => {
    setState(next);
  }, []);

  return { state, send, can, go } as const;
}

export function FlowMachineProvider({ value, children }: { value: FlowContextValue, children: React.ReactNode }) {
  const ctx = useMemo(() => value, [value]);
  return <FlowContext.Provider value={ctx}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within a FlowMachineProvider");
  return ctx;
}

