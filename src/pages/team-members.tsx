import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BrickHeader, BrickFooter } from "@/components";
import { useToast } from "@/hooks/use-toast";
import { Plus, Check, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { createTeamMember, updateTeamMember, deleteTeamMember, listTeamMembers, type TeamMember } from "@/lib/team-members";
import { useTeamMemberForm } from "@/hooks/use-team-member-form";

export default function TeamMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { state, setField, startEdit, reset } = useTeamMemberForm();
  const { name, role, email, phone, projectId, editing } = state;

  const { data: members } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    queryFn: listTeamMembers,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<TeamMember, "id">) => createTeamMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro adicionado" });
      reset();
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
    mutationFn: ({ id, ...data }: TeamMember) =>
      updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({ title: "Membro atualizado" });
      reset();
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
    mutationFn: (id: string) => deleteTeamMember(id),
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
    startEdit(member);
  };

  const handleCancel = () => {
    reset();
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
                onChange={(e) => setField("name", e.target.value)}
                className="md:w-1/3"
              />
              <Input
                placeholder="Função"
                value={role}
                onChange={(e) => setField("role", e.target.value)}
                className="md:w-1/3"
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setField("email", e.target.value)}
                className="md:w-1/3"
              />
              <Input
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setField("phone", e.target.value)}
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

