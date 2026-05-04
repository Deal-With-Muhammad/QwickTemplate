import { ResolveVariant } from '../../../features/pos/variant-resolver';
import LoyaltyUi1 from '../../../features/pos/variants/ui-1/loyalty';
import LoyaltyUi2 from '../../../features/pos/variants/ui-2/loyalty';
import LoyaltyUi3 from '../../../features/pos/variants/ui-3/loyalty';
import LoyaltyUi4 from '../../../features/pos/variants/ui-4/loyalty';

export default function Loyalty() {
  return (
    <ResolveVariant
      fallback="ui-3"
      variants={{
        'ui-1': LoyaltyUi1,
        'ui-2': LoyaltyUi2,
        'ui-3': LoyaltyUi3,
        'ui-4': LoyaltyUi4,
      }}
    />
  );
}
