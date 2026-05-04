import { ResolveVariant } from '../../../features/pos/variant-resolver';
import ScanUi1 from '../../../features/pos/variants/ui-1/scan';
import ScanUi2 from '../../../features/pos/variants/ui-2/scan';
import ScanUi3 from '../../../features/pos/variants/ui-3/scan';
import ScanUi4 from '../../../features/pos/variants/ui-4/scan';

export default function Scan() {
  return (
    <ResolveVariant
      fallback="ui-3"
      variants={{
        'ui-1': ScanUi1,
        'ui-2': ScanUi2,
        'ui-3': ScanUi3,
        'ui-4': ScanUi4,
      }}
    />
  );
}
