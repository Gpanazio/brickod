import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BrickHeader, BrickFooter } from "@/components";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Plus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export default function TeamMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const { data: members } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    queryFn: () => apiRequest("/api/team-members"),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<TeamMember, "id">) =>
      apiRequest("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro adicionado" });
      setName("");
      setRole("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TeamMember) =>
      apiRequest(`/api/team-members/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro atualizado" });
      setEditing(null);
      setName("");
      setRole("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/team-members/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro removido" });
    },
  });

  const handleSubmit = () => {
    if (!name.trim() || !role.trim()) return;
    if (editing) {
      updateMutation.mutate({ ...editing, name: name.trim(), role: role.trim() });
    } else {
      createMutation.mutate({ name: name.trim(), role: role.trim() });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setName(member.name);
    setRole(member.role);
  };

  const handleCancel = () => {
    setEditing(null);
    setName("");
    setRole("");
  };

  return (
    <div className="min-h-screen brick-light font-inter text-brick-dark">
      <BrickHeader
        onExportPDF={() => {}}
        onSave={() => {}}
        hasUnsavedChanges={false}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Editar membro" : "Adicionar membro"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="md:w-1/3"
              />
              <Input
                placeholder="Função"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="md:w-1/3"
              />
              <Button
                type="button"
                variant="brick"
                disabled={!name.trim() || !role.trim()}
                onClick={handleSubmit}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editing ? "Atualizar" : "Adicionar"}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membros da equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(member)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(member.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!members || members.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhum membro encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <BrickFooter />
    </div>
  );
}

