import { ZipTransformer } from '@blocksuite/affine/widgets/linked-doc';

import type { Workspace } from '../entities/workspace';
import { getAFFiNEWorkspaceSchema } from '../global-schema';

const DOC_LOAD_TIMEOUT = 10000;

/**
 * NPNnote: download every doc of the workspace as a zip of JSON snapshots
 * (plus attached files). Nothing leaves the browser except the downloaded file.
 */
export async function exportWorkspaceBackup(workspace: Workspace) {
  const docs = Array.from(workspace.docCollection.docs.values());
  // docs that were never opened are not loaded from IndexedDB yet
  await Promise.all(
    docs.map(async doc => {
      doc.load();
      await workspace.engine.doc.waitForDocLoaded(
        doc.id,
        AbortSignal.timeout(DOC_LOAD_TIMEOUT)
      );
    })
  );
  await ZipTransformer.exportDocs(
    workspace.docCollection,
    getAFFiNEWorkspaceSchema(),
    docs.map(doc => doc.getStore())
  );
  return docs.length;
}

/**
 * NPNnote: add the docs of a backup zip to the workspace
 */
export async function importWorkspaceBackup(workspace: Workspace, file: Blob) {
  const docs = await ZipTransformer.importDocs(
    workspace.docCollection,
    getAFFiNEWorkspaceSchema(),
    new Blob([file], { type: 'application/zip' })
  );
  return docs.filter(doc => !!doc).length;
}
