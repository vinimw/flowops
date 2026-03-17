import type { Flow } from "@/domain/flow/types";

export type Command = {
  name: string;
  do: (flow: Flow) => Flow;
  undo: (flow: Flow) => Flow;
};

export class CommandStack {
  private past: Command[] = [];
  private future: Command[] = [];

  canUndo() {
    return this.past.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  apply(flow: Flow, cmd: Command): Flow {
    const next = cmd.do(flow);
    this.past.push(cmd);
    this.future = [];
    return next;
  }

  undo(flow: Flow): Flow {
    const cmd = this.past.pop();
    if (!cmd) return flow;
    const next = cmd.undo(flow);
    this.future.push(cmd);
    return next;
  }

  redo(flow: Flow): Flow {
    const cmd = this.future.pop();
    if (!cmd) return flow;
    const next = cmd.do(flow);
    this.past.push(cmd);
    return next;
  }

  reset() {
    this.past = [];
    this.future = [];
  }
}
