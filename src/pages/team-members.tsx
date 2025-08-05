import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BrickHeader, BrickFooter } from "@/components";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Plus, Check, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  projectId?: string | null;
}

export default function TeamMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
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
      setEmail("");
      setPhone("");
      setProjectId(undefined);
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro ao adicionar membro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível adicionar o membro.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, role, email, phone, projectId }: TeamMember) =>
      apiRequest(`/api/team-members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          email,
          phone,
          ...(projectId ? { projectId } : {}),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro atualizado" });
      setEditing(null);
      setName("");
      setRole("");
      setEmail("");
      setPhone("");
      setProjectId(undefined);
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro ao atualizar membro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o membro.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/team-members/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro removido" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro ao remover membro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível remover o membro.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!name.trim() || !role.trim() || !email.trim() || !phone.trim()) return;
    const payload = {
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ...(projectId ? { projectId } : {}),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setName(member.name);
    setRole(member.role);
    setEmail(member.email);
    setPhone(member.phone);
    setProjectId(member.projectId ?? undefined);
  };

  const handleCancel = () => {
    setEditing(null);
    setName("");
    setRole("");
    setEmail("");
    setPhone("");
    setProjectId(undefined);
  };

  return (
    <div className="min-h-screen bg-[var(--brick-light)] font-inter text-[var(--brick-dark)]">
      <BrickHeader
        onExportPDF={() => {}}
        onSave={() => {}}
        hasUnsavedChanges={false}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Link href="/" className="block w-fit">
          <Button variant="outlineBrick">Voltar</Button>
        </Link>
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
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="md:w-1/3"
              />
              <Input
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="md:w-1/3"
              />
              <Button
                type="button"
                variant="brick"
                disabled={!name.trim() || !role.trim() || !email.trim() || !phone.trim()}
                onClick={handleSubmit}
              >
                {editing ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
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
                          <Edit className='w-4 h-4 mr-1' />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(member.id)}
                        >
                          <Trash2 className='w-4 h-4 mr-1' />
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

