import { apiRequest } from "@/lib/api";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  projectId?: string | null;
}

/**
 * Obtém a lista de membros da equipe.
 */
export async function listTeamMembers(): Promise<TeamMember[]> {
  return apiRequest("/api/team-members");
}

/**
 * Adiciona um novo membro da equipe.
 * @param data Dados do membro sem o identificador.
 * @returns Membro criado retornado pela API.
 */
export async function createTeamMember(
  data: Omit<TeamMember, "id">
): Promise<TeamMember> {
  return apiRequest("/api/team-members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Atualiza um membro existente.
 * @param id Identificador do membro.
 * @param data Campos a serem atualizados.
 * @returns Membro atualizado retornado pela API.
 */
export async function updateTeamMember(
  id: string,
  data: Partial<Omit<TeamMember, "id">>
): Promise<TeamMember> {
  return apiRequest(`/api/team-members/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Remove um membro pelo identificador.
 * @param id Identificador do membro a ser removido.
 */
export async function deleteTeamMember(id: string): Promise<void> {
  await apiRequest(`/api/team-members/${id}`, { method: "DELETE" });
}

