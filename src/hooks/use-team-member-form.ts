import { useReducer } from "react";
import type { TeamMember } from "@/lib/team-members";

interface FormState {
  name: string;
  role: string;
  email: string;
  phone: string;
  projectId?: string;
  editing: TeamMember | null;
}

export const initialState: FormState = {
  name: "",
  role: "",
  email: "",
  phone: "",
  projectId: undefined,
  editing: null,
};

/**
 * Ações possíveis para manipular o estado do formulário de membros.
 */
export type FormAction =
  | { type: "SET_FIELD"; field: keyof Omit<FormState, "editing" | "projectId">; value: string }
  | { type: "SET_PROJECT"; value: string | undefined }
  | { type: "START_EDIT"; member: TeamMember }
  | { type: "RESET" };

export function teamMemberFormReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_PROJECT":
      return { ...state, projectId: action.value };
    case "START_EDIT":
      return {
        name: action.member.name,
        role: action.member.role,
        email: action.member.email,
        phone: action.member.phone,
        projectId: action.member.projectId ?? undefined,
        editing: action.member,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useTeamMemberForm() {
  const [state, dispatch] = useReducer(teamMemberFormReducer, initialState);

  const setField = (field: keyof Omit<FormState, "editing" | "projectId">, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  const setProject = (value: string | undefined) =>
    dispatch({ type: "SET_PROJECT", value });

  const startEdit = (member: TeamMember) => dispatch({ type: "START_EDIT", member });

  const reset = () => dispatch({ type: "RESET" });

  return { state, setField, setProject, startEdit, reset };
}

