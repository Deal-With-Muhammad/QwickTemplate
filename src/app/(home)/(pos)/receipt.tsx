import { ResolveVariant } from '../../../features/pos/variant-resolver';
import ReceiptUi1 from '../../../features/pos/variants/ui-1/receipt';
import ReceiptUi2 from '../../../features/pos/variants/ui-2/receipt';
import ReceiptUi3 from '../../../features/pos/variants/ui-3/receipt';
import ReceiptUi4 from '../../../features/pos/variants/ui-4/receipt';

export default function Receipt() {
  return (
    <ResolveVariant
      fallback="ui-3"
      variants={{
        'ui-1': ReceiptUi1,
        'ui-2': ReceiptUi2,
        'ui-3': ReceiptUi3,
        'ui-4': ReceiptUi4,
      }}
    />
  );
}
