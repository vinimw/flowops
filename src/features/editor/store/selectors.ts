import type { Flow } from "@/domain/flow/types";
import { useEditorStore } from "./editor.store";

export const selectFlow = (s: ReturnType<typeof useEditorStore.getState>) =>
  s.flow;
export const selectSelectedNodeId = (
  s: ReturnType<typeof useEditorStore.getState>
) => s.selectedNodeId;
export const selectDirty = (s: ReturnType<typeof useEditorStore.getState>) =>
  s.dirty;
export const selectDiagnostics = (
  s: ReturnType<typeof useEditorStore.getState>
) => s.diagnostics;

export function useFlow(): Flow | null {
  return useEditorStore((s) => s.flow);
}
