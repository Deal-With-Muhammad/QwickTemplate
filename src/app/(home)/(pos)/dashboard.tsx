import { ResolveVariant } from '../../../features/pos/variant-resolver';
import DashboardUi1 from '../../../features/pos/variants/ui-1/dashboard';
import DashboardUi2 from '../../../features/pos/variants/ui-2/dashboard';
import DashboardUi3 from '../../../features/pos/variants/ui-3/dashboard';
import DashboardUi4 from '../../../features/pos/variants/ui-4/dashboard';

export default function Dashboard() {
  return (
    <ResolveVariant
      fallback="ui-3"
      variants={{
        'ui-1': DashboardUi1,
        'ui-2': DashboardUi2,
        'ui-3': DashboardUi3,
        'ui-4': DashboardUi4,
      }}
    />
  );
}
