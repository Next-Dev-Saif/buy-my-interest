export interface AgentTool {
  name: string;
  description: string;
  parameterDefinitions: Record<string, any>;
  execute: (params: any, context: { userId: string, email?: string, role?: string }) => Promise<any>;
}
