import test from "node:test";
import assert from "node:assert/strict";
import { teamMemberFormReducer, initialState, type FormAction } from "./use-team-member-form.ts";
import type { TeamMember } from "@/lib/team-members";

test("teamMemberFormReducer sets field", () => {
  const action: FormAction = { type: "SET_FIELD", field: "name", value: "João" };
  const state = teamMemberFormReducer(initialState, action);
  assert.equal(state.name, "João");
});

test("teamMemberFormReducer starts edit", () => {
  const member: TeamMember = {
    id: "1",
    name: "Maria",
    role: "Diretora",
    email: "maria@example.com",
    phone: "123",
  };
  const action: FormAction = { type: "START_EDIT", member };
  const state = teamMemberFormReducer(initialState, action);
  assert.equal(state.editing?.id, "1");
  assert.equal(state.name, "Maria");
});

test("teamMemberFormReducer resets state", () => {
  const modified = { ...initialState, name: "Teste" };
  const action: FormAction = { type: "RESET" };
  const state = teamMemberFormReducer(modified, action);
  assert.deepEqual(state, initialState);
});

