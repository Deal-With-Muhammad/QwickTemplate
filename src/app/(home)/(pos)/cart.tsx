import { ResolveVariant } from '../../../features/pos/variant-resolver';
import CartUi1 from '../../../features/pos/variants/ui-1/cart';
import CartUi2 from '../../../features/pos/variants/ui-2/cart';
import CartUi3 from '../../../features/pos/variants/ui-3/cart';
import CartUi4 from '../../../features/pos/variants/ui-4/cart';

export default function Cart() {
  return (
    <ResolveVariant
      fallback="ui-3"
      variants={{
        'ui-1': CartUi1,
        'ui-2': CartUi2,
        'ui-3': CartUi3,
        'ui-4': CartUi4,
      }}
    />
  );
}
