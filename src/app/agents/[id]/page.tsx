import { AgentEditorView } from "@/features/agents/agent-editor-view";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AgentEditorView agentId={id} />;
}

