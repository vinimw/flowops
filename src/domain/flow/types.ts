export type SchemaVersion = 1;

export type NodeType = 'trigger' | 'agent' | 'condition' | 'action' | 'output';

export type RunStatus = 'running' | 'success' | 'error' | 'canceled';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type Position = { x: number; y: number };

export type ISODateString = string;

export type TriggerType = 'manual' | 'webhook';

export type ActionType = 'http_request' | 'transform' | 'notify';

export type OutputFormat = 'text' | 'json';

export type DiagnosticSeverity = 'error' | 'warn';

export type DiagnosticCode =
  | 'NO_TRIGGER'
  | 'MULTIPLE_TRIGGERS'
  | 'NO_OUTPUT'
  | 'EDGE_INVALID_ENDPOINT'
  | 'CYCLE_DETECTED'
  | 'CONDITION_NO_OUTPUT'
  | 'CONDITION_MISSING_BRANCH';

export type Diagnostic = {
  code: DiagnosticCode;
  severity: DiagnosticSeverity;
  message: string;
  nodeId?: string;
  edgeId?: string;
};

export type DomainEdge = {
  id: string;
  source: string;
  target: string;
  label?: string; // e.g. "true" | "false"
};

export type TriggerNodeData = {
  triggerType: TriggerType;
  description?: string;
};

export type AgentNodeData = {
  agentName: string;
  instruction: string;
  model: 'mock';
  timeoutMs?: number;
};

export type ConditionNodeData = {
  expression: string;
  trueLabel?: string; // default "true"
  falseLabel?: string; // default "false"
};

export type ActionNodeData = {
  actionType: ActionType;
  config: Record<string, unknown>;
};

export type OutputNodeData = {
  format: OutputFormat;
  storeAs: string;
};

export type BaseDomainNode = {
  id: string;
  position: Position;
};

export type TriggerNode = BaseDomainNode & {
  type: 'trigger';
  data: TriggerNodeData;
};

export type AgentNode = BaseDomainNode & {
  type: 'agent';
  data: AgentNodeData;
};

export type ConditionNode = BaseDomainNode & {
  type: 'condition';
  data: ConditionNodeData;
};

export type ActionNode = BaseDomainNode & {
  type: 'action';
  data: ActionNodeData;
};

export type OutputNode = BaseDomainNode & {
  type: 'output';
  data: OutputNodeData;
};

export type DomainNode = TriggerNode | AgentNode | ConditionNode | ActionNode | OutputNode;

export type Flow = {
  id: string;
  name: string;
  schemaVersion: SchemaVersion;
  nodes: DomainNode[];
  edges: DomainEdge[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastRun?: {
    runId: string;
    status: RunStatus;
    startedAt: ISODateString;
    finishedAt?: ISODateString;
  };
};