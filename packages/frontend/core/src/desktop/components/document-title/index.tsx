import { NotificationCountService } from '@affine/core/modules/notification';
import { WorkbenchService } from '@affine/core/modules/workbench';
import { appNames } from '@affine/core/utils/channel';
import { useLiveData, useService } from '@toeverything/infra';
import { useEffect } from 'react';

export const DocumentTitle = () => {
  const notificationCountService = useService(NotificationCountService);
  const notificationCount = useLiveData(notificationCountService.count$);
  const workbenchService = useService(WorkbenchService);
  const workbenchView = useLiveData(workbenchService.workbench.activeView$);
  const viewTitle = useLiveData(workbenchView.title$);

  useEffect(() => {
    const prefix = notificationCount > 0 ? `(${notificationCount}) ` : '';
    const appName = appNames[BUILD_CONFIG.appBuildType];
    document.title =
      prefix + (viewTitle ? `${viewTitle} · ${appName}` : appName);

    return () => {
      document.title = appName;
    };
  }, [notificationCount, viewTitle]);

  return null;
};
