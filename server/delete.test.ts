import assert from 'node:assert/strict';
import { DatabaseStorage } from './storage';

async function run() {
  const storage = new DatabaseStorage();

  const callSheet = await storage.createCallSheet({
    productionTitle: 'Test',
    shootingDate: '2024-01-01',
    locations: [],
    scenes: [],
    contacts: [],
    crewCallTimes: [],
    castCallTimes: [],
    generalNotes: ''
  });
  assert.equal(await storage.deleteCallSheet(callSheet.id), true);

  const template = await storage.createTemplate({
    name: 'T',
    description: 'D',
    category: 'C',
    templateData: {
      locations: [],
      scenes: [],
      contacts: [],
      crewCallTimes: [],
      castCallTimes: [],
      generalNotes: ''
    }
  });
  assert.equal(await storage.deleteTemplate(template.id), true);

  const project = await storage.createProject({ name: 'P' });
  assert.equal(await storage.deleteProject(project.id), true);

  const member = await storage.createTeamMember({ name: 'M' });
  assert.equal(await storage.deleteTeamMember(member.id), true);

}

run();
