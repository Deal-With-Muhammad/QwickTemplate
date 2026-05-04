import { ResolveVariant } from '../../../features/pos/variant-resolver';
import PaymentUi1 from '../../../features/pos/variants/ui-1/payment';
import PaymentUi2 from '../../../features/pos/variants/ui-2/payment';
import PaymentUi3 from '../../../features/pos/variants/ui-3/payment';
import PaymentUi4 from '../../../features/pos/variants/ui-4/payment';

export default function Payment() {
  return (
    <ResolveVariant
      fallback="ui-3"
      variants={{
        'ui-1': PaymentUi1,
        'ui-2': PaymentUi2,
        'ui-3': PaymentUi3,
        'ui-4': PaymentUi4,
      }}
    />
  );
}
