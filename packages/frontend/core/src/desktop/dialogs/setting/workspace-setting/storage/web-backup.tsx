import { SettingRow } from '@affine/component/setting-components';
import { Button } from '@affine/component/ui/button';
import { useWorkspaceBackup } from '@affine/core/components/hooks/affine/use-workspace-backup';
import type { Workspace } from '@affine/core/modules/workspace';
import { useI18n } from '@affine/i18n';
import { ExportIcon, ImportIcon } from '@blocksuite/icons/rc';

/**
 * NPNnote: backup for the browser-only build
 */
export const WebBackupPanel = ({ workspace }: { workspace: Workspace }) => {
  const t = useI18n();
  const { busy, exportBackup, importBackup } = useWorkspaceBackup(workspace);

  return (
    <>
      <SettingRow
        name={t['com.npnnote.backup.export']()}
        desc={t['com.npnnote.backup.export.description']()}
      >
        <Button
          variant="primary"
          data-testid="npnnote-export-backup"
          onClick={exportBackup}
          loading={busy}
          disabled={busy}
          prefix={<ExportIcon />}
        >
          {t['com.npnnote.backup.export']()}
        </Button>
      </SettingRow>
      <SettingRow
        name={t['com.npnnote.backup.import']()}
        desc={t['com.npnnote.backup.import.description']()}
      >
        <Button
          data-testid="npnnote-import-backup"
          onClick={importBackup}
          disabled={busy}
          prefix={<ImportIcon />}
        >
          {t['com.npnnote.backup.import']()}
        </Button>
      </SettingRow>
    </>
  );
};
