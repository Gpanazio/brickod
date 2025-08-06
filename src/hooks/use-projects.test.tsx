import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JSDOM } from 'jsdom';
import esmock from 'esmock';
import type { SelectProject } from '@shared/schema';

const STORAGE_KEY = 'brick-projects';
const apiModulePath = '../lib/api.ts';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
  // @ts-ignore
  global.window = dom.window;
  // @ts-ignore
  global.document = dom.window.document;
  // @ts-ignore
  global.navigator = dom.window.navigator;
  // @ts-ignore
  global.localStorage = dom.window.localStorage;
}

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client }, children);
  };
}

test('deleteProject removes project from state and localStorage', async () => {
  const project: SelectProject = {
    id: '1',
    name: 'Test',
    description: '',
    client: '',
    status: 'ativo',
    createdAt: new Date().toISOString() as unknown as Date,
    updatedAt: new Date().toISOString() as unknown as Date,
  };

  let deleted = false;
  const apiRequest = async (_path: string, options?: RequestInit) => {
    if (options?.method === 'DELETE') {
      deleted = true;
      return undefined;
    }
    return deleted ? [] : [project];
  };

  const { useProjects } = await esmock('./use-projects.ts', {
    [apiModulePath]: { apiRequest },
  });

  setupDom();
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([project]));

  const queryClient = new QueryClient();
  const { result } = renderHook(() => useProjects(), {
    wrapper: createWrapper(queryClient),
  });

  await waitFor(() => assert.equal(result.current.projects.length, 1));

  act(() => {
    result.current.deleteProject(project.id);
  });

  await waitFor(() => assert.equal(result.current.projects.length, 0));
  assert.deepEqual(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'), []);

  queryClient.clear();
});

test('deleteProject cleans local state even if server delete fails', async () => {
  const project: SelectProject = {
    id: '1',
    name: 'Test',
    description: '',
    client: '',
    status: 'ativo',
    createdAt: new Date().toISOString() as unknown as Date,
    updatedAt: new Date().toISOString() as unknown as Date,
  };

  let deleteAttempted = false;
  const apiRequest = async (_path: string, options?: RequestInit) => {
    if (options?.method === 'DELETE') {
      deleteAttempted = true;
      throw new Error('fail');
    }
    return deleteAttempted ? [] : [project];
  };

  const { useProjects } = await esmock('./use-projects.ts', {
    [apiModulePath]: { apiRequest },
  });

  setupDom();
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([project]));

  const queryClient = new QueryClient();
  const { result } = renderHook(() => useProjects(), {
    wrapper: createWrapper(queryClient),
  });

  await waitFor(() => assert.equal(result.current.projects.length, 1));

  act(() => {
    result.current.deleteProject(project.id);
  });

  await waitFor(() => assert.equal(result.current.projects.length, 0));
  assert.deepEqual(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'), []);

  queryClient.clear();
});

