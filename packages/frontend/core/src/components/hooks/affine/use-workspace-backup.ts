import { notify } from '@affine/component';
import {
  exportWorkspaceBackup,
  importWorkspaceBackup,
  type Workspace,
} from '@affine/core/modules/workspace';
import { useI18n } from '@affine/i18n';
import { useCallback, useState } from 'react';

/**
 * NPNnote: export / import the whole workspace as a zip of JSON snapshots
 */
export const useWorkspaceBackup = (workspace: Workspace) => {
  const t = useI18n();
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (task: () => Promise<string>) => {
      if (busy) return;
      setBusy(true);
      try {
        notify.success({ title: await task() });
      } catch (e) {
        console.error(e);
        notify.error({
          title: t['com.npnnote.backup.failed'](),
          message: e instanceof Error ? e.message : String(e),
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, t]
  );

  const exportBackup = useCallback(() => {
    run(async () => {
      const count = await exportWorkspaceBackup(workspace);
      return t['com.npnnote.backup.export.success']({
        count: String(count),
      });
    }).catch(console.error);
  }, [run, t, workspace]);

  const importBackup = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      run(async () => {
        const count = await importWorkspaceBackup(workspace, file);
        return t['com.npnnote.backup.import.success']({
          count: String(count),
        });
      }).catch(console.error);
    };
    input.click();
  }, [run, t, workspace]);

  return { busy, exportBackup, importBackup };
};
