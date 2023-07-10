/**
 * Simple Zustand hook for easy access to the plugin options by other components.
 */
import { create } from "zustand";

import { PluginOptions } from "./types";

interface PluginOptionsState {
  options: PluginOptions;
  setOptions(options: PluginOptions): void;
}

const initialState = {
  options: {} as PluginOptions,
};

export const usePluginOptions = create<PluginOptionsState>()((set) => ({
  ...initialState,
  setOptions(options) {
    set({ options });
  },
}));
