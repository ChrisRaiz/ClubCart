import { useRef, useState } from 'react';
import ActionBar from '../../components/ActionBar/ActionBar';
import RunStatus from '../../components/ActionBar/RunStatus';
import Header from '../../components/Header/Header';
import ListDialog from '../../components/ListDialog/ListDialog';
import OutputPanel from '../../components/OutputPanel/OutputPanel';
import UrlForm from '../../components/UrlForm/UrlForm';
import useUrlList from '../../hooks/useUrlList';
import { getProducts } from '../../lib/products';
import {
  playError,
  playFinale,
  playReset,
  playStart,
  playTick,
} from '../../lib/sounds';
import type { Product, Progress } from '../../types';
import './Home.css';

type HomeProps = {
  // Asks App to remount this screen with fresh state (see App.tsx).
  onReset: () => void;
  // True when this screen was mounted by a reset (plays the pop-in).
  justReset?: boolean;
};

/** The main screen: holds the app's state and wires the components together. */
export default function Home({ onReset, justReset = false }: HomeProps) {
  const {
    urls,
    urlInput,
    changeUrlInput,
    aliasInput,
    setAliasInput,
    qty,
    setQty,
    urlError,
    inputAnim,
    clearInputAnim,
    addCount,
    addUrl,
    removeUrl,
    isDirty,
  } = useUrlList();

  // getProducts returns a list, so this holds an array (empty until loaded).
  const [products, setProducts] = useState<Product[]>([]);
  // The text shown in the output box; '' shows the placeholder.
  const [output, setOutput] = useState('');
  const listDialog = useRef<HTMLDialogElement>(null);

  // Progress of the current run; null when nothing is running.
  const [progress, setProgress] = useState<Progress | null>(null);
  const busy = progress !== null;

  // ─── Reset ───
  // True when anything differs from how the app first opens; the Reset
  // button is disabled otherwise. Add any new state here that Reset clears.
  const canReset = isDirty || products.length > 0 || output !== '';

  // While true, the page plays its reset-out animation; when it ends,
  // onReset() remounts the screen fresh (see App).
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    if (!canReset || busy || resetting) return;
    playReset();
    listDialog.current?.close();
    // Reduced motion: no animation, so no animationend event; reset right away.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onReset();
      return;
    }
    setResetting(true);
  };

  const updateProducts = () => {
    if (busy) return; // already running; the button is disabled too
    if (!urls.length) {
      playError(); // nothing to load
      return;
    }
    setProgress({ done: 0, total: urls.length });
    playStart();

    const formatItems = (_products: Product[]) => {
      const quote = (value: unknown) =>
        `'${String(value ?? '')
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/\r?\n/g, '\\n')}'`;

      return _products
        .map(
          (product) =>
            `        {id: ${quote(product.sku)}, qty: ${product.qty}, offer: ${quote(product.offerId)}, name: ${quote(product.name)}, alias: ${quote(product.alias)}},`,
        )
        .join('\n');
    };

    // getProducts takes the entries themselves (UrlEntry[]).
    getProducts(urls, (done, total) => {
      setProgress({ done, total });
      if (done < total) playTick(); // the finale covers the last one
    })
      .then((res) => {
        // getProducts returns undefined when the list is empty.
        if (res) setProducts(res);
        // What the output box shows after Create String. Change this to
        // whatever string you want displayed.
        if (res?.length)
          setOutput(`;(async () => {
    // ─── CONFIG ──────────────────────────────────────────────────
    const ITEMS = [
    ${formatItems(res)}
      ];
    // ─────────────────────────────────────────────────────────────

  const HASHES = {
    updateItems: '7476eaf9dcdfc6c2f1c40b5e4fbb828d5e6b68dfa9b42b6af186c20109b9646b',
    getCart: '75b76d85e358b21c00e789810fa55bc14b808c6aa8848a56935973337365c93e'
  };

  // ─── HELPERS ──────────────────────────────────────────────────
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const randHex = n => [...crypto.getRandomValues(new Uint8Array(n / 2))].map(b => b.toString(16).padStart(2, '0')).join('');
  const getCookie = name => document.cookie.split('; ').find(c => c.startsWith(name + '='))?.slice(name.length + 1);

  let cart = getCookie('astract');
  const authToken = getCookie('authToken');

  if (!cart) throw new Error('Missing cart cookie: astract');
  if (!authToken) throw new Error('Missing auth cookie: authToken');

  const itemCount = ITEMS.reduce((sum, item) => sum + item.qty, 0);
  console.log(\`Starting ATC for \${ITEMS.length} items (\${itemCount} total qty)\`);

  // ─── GRAPHQL REQUEST ──────────────────────────────────────────
  async function gql(op, hash, kind, method, variables) {
        const trace = randHex(32);
        
    const url = 
            method === 'GET' && variables 
                ? \`/orchestra/cartxo/graphql/\${op}/\${hash}?variables=\${encodeURIComponent(JSON.stringify(variables))}\`
                : \`/orchestra/cartxo/graphql/\${op}/\${hash}\`;

    const res = await fetch(url, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        authorization: authToken,
        'content-type': 'application/json',
        downlink: '10',
        dpr: '1',
        priority: 'u=1, i',
        'sec-ch-ua': '\\'Not;A=Brand\\';v=\\'8\\', \\'Chromium\\';v=\\'150\\', \\'Microsoft Edge\\';v=\\'150\\'',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\\'Windows\\'',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'tenant-id': 'gj9b60',
        traceparent: \`00-\${trace}-\${randHex(16)}-00\`,
        'wm-client-traceid': trace,
        wm_mp: 'true',
        wm_page_url: location.href,
        'x-apollo-operation-name': op,
        'x-o-bu': 'SAMS-US',
        'x-o-ccm': 'server',
        'x-o-gql-query': \`\${kind} \${op}\`,
        'x-o-mart': 'B2C',
        'x-o-platform': 'rweb',
        'x-o-segment': 'oaoh'
      },
      body: method === 'GET' ? undefined : (variables ? JSON.stringify({variables}) : null)
    });

    const data = await res.json();
    if (!res.ok || data.errors) {
      throw new Error(\`\${op}: \${data.errors?.[0]?.message || res.status}\`);
    }
    return data;
  }

  // ─── CART QUERY VARIABLES ──────────────────────────────────────
  function getCartVariables() {
    return {
      cartInput: {
        cartId: getCookie('astract') || cart,
        forceRefresh: true,
        enableLiquorBox: false,
        enableCartSplitClarity: false,
        features: ['lmpdel', 'mlrx', 'maappl']
      },
      includePartialFulfillmentSwitching: false,
      enableAEBadge: true,
      includeExpressSla: false,
      includeQueueing: true,
      enableWeeklyReservationCartBookslot: true,
      enableCartBookslotShortcut: false,
      enableACCScheduling: true,
      enableWalmartPlusFreeDiscountedExpress: true,
      enableDiscountedOrHolidayExpress: true,
      enableBenefitSavings: false
    };
  }
    
  // ─── CHECK CART QUANTITY ───────────────────────────────────────
  async function checkCart(itemId) {
    const res = await gql('getCart', HASHES.getCart, 'query', 'GET', getCartVariables());
    const cartItems = res?.data?.cart?.lineItems || [];
    if (cartItems.length === 0) return 0;

    const found = cartItems.find(item => item?.product?.usItemId === itemId);
    const quantity = found?.quantity || 0;
    console.log(\`Cart quantity for \${itemId}:\`, quantity);
    return quantity;
  }

  // ─── UPDATE CART VARIABLES ─────────────────────────────────────
  function getUpdateVariables(item) {
    return {
      getDetailedAccesspoint: false,
      input: {
        enableLiquorBox: false,
        cartId: getCookie('astract') || cart,
        items: [{
          offerId: item.offer,
          quantity: item.qty,
          usItemId: item.id,
          additionalInfo: {
            registry: {
              id: '252811fd-3db1-439f-a329-278137c5aa0e',
              type: 'WL'
            }
          },
          name: item.name
        }],
        skipPolicyCheck: false,
        cartLeanMode: false,
        enableCartSplitClarity: false,
        features: ['lmpdel', 'mlrx', 'maappl']
      },
      includePartialFulfillmentSwitching: false,
      enableAEBadge: false,
      includeExpressSla: false,
      includeQueueing: false,
      enableCartBookslotShortcut: false,
      enableACCScheduling: true,
      enableWalmartPlusFreeDiscountedExpress: true,
      enableDiscountedOrHolidayExpress: true,
      enableBenefitSavings: false,
      enableUnifiedBadges: false,
      enableCartLevelMSI: false,
      enablePickupNotAvailable: false,
      enableReturnsLabel: false,
      enableStarRatings: false,
      enableSpendLimit: false,
      enableMsiMci: true,
      enableTaxBreakdown: false,
      enableI18nWave1: false,
      enableWplusPetBenefit: false,
      enableCartLevelPromotions: false,
      enableOrderCutOffTime: false,
      enableHotCartFeature: false,
      enableMOQ: false,
      enableMOQVariants: false,
      enablePetRxManualRefill: true,
      enableItemLevelCheckout: false,
      enableSuggestedSlotAvailability: true,
      enablePFS: true,
      enableSubscriptionsInTransaction: true,
      enableSubscribeToSaveNudge: false,
      enableE2EPickupEnhancement: false,
      enableExpressPickup: false,
      enableB2BCategoryRestriction: false,
      enableSubscriptionDiscounts: false,
      enablePromoDiscount: false,
      enableWplusACCPayForServiceOnline: false,
      includeItemPackaging: false,
      enableMultiStorePickup: false,
      enableShopAllNode: false,
      enableWFSGlobal: false,
      includeFulfillmentSwitchOptions: false,
      enableMaxItemAllowedForRegularSlot: false,
      enableAvailableFinancingOptions: false,
      enableFreeDeliveryThreshold: false,
      enableShippingOptions: true,
      enableShippingFeeClarity: false,
      getPriceInfoDetails: false,
      enableAccQuantityNudge: false,
      enableFeeThresholdBar: false,
      enableWic: false,
      enableColdChainExpansion: false,
      enableGEP: false,
      enableIsEligibleForFreeTrialV1: false,
      enableMaximumThreshold: false,
      enableSellerFeeBreakdown: false,
      enableLatLonForAddress: false,
      enablePaymentMethodPromotion: false,
      enablePreferredStore: false,
      enable3pEGiftCardPersonalization: false,
      enableAppleCareFreeTrials: false,
      enableUnscheduledPickup: false,
      enableUnscheduledShippingOptions: false,
      enableShowSavingsGrandTotal: false,
      enableSparkStore: false,
      enableVolumePricing: false,
      enableStreamlinedBadges: false,
      enableFIGCartFulfillmentOption: true,
      enableExpressReservationEndTime: false,
      subscriptionInTransactionAndDetailed: false,
      enablePriceDetailsSavings: false,
      enableItemTypeAttributes: true,
      includeFitment: true,
      enablePromotionalMetaData: true,
      enableEligibleCareplans: true,
      enableShowACCSchedulingInCart: true,
      enableAOSLineItemId: true,
      enableSubscriptionsInTransactionDiscount: false,
      enableDestinationTax: false,
      enableStaticMessageType: true,
      enableEachWeightItem: false,
      enableOptimisticWeightUpdate: false,
      enableAOSPriceChangeExp: false,
      enableAOSWplusPriceChange: false,
      enableCheckoutableErrorAttributes: false,
      enableFlowerDelivery: true,
      enableOutOfCountry: false,
      enableExpressStoreBadge: false,
      enableAllowItemQtyEditable: true,
      enableAllowItemRemoval: true,
      enableAllowSaveForLaterForItem: true,
      enableVPForACCItems: false,
      enableSpecialOrderMultiline: false,
      enableIntentControl: false,
      enableAOSModuleAttribute: false,
      enableLocalizedStringForReservation: true,
      enableAOSRearchitect: false,
      enableAOSWplusDiscount: false,
      enableDynamicExpressSlotType: false,
      enableWcpEligibility: false,
      enableBadges: false,
      enablePayForSpeed: false,
      enableDroneDelivery: false,
      enableCCAFlow: false,
      enableRxpd: false,
      enableRxpdLunchHours: false,
      enableIsTobaccoField: true,
      enableCustomizableItemsPhase1: false,
      enableQsr4w: false,
      enableWplusSubscribeAndSave: false,
      enableTheFarmersDog: false,
      enableExpressAvailability: false,
      detailed: false,
      includeExtras: true,
      includeMpGroup: false,
      includeClipRewards: false,
      enableWeightedItems: false,
      enableDetailedBeacon: false,
      enableOrderLimit: false,
      includeGrandAndSavedSubtotal: false,
      enableQSRImplicitReservation: false,
      includeGepShippingThresholdData: false,
      enableGicEngagement: false,
      enableUpstreamErrorCode: true,
      includeFulfillmentBadge: true,
      includeFulfillmentItemGroups: false,
      includeOtherDetailed: true,
      includeWeeklyReservation: false,
      enableSavingsBreakup: false,
      fetchAddOnServices: false
    };
  }
    
  // ─── ADD ITEMS WITH RETRY LOGIC ────────────────────────────────
  for (const item of ITEMS) {
        console.log(\`▶ ATC Starting for \${item.name}\`);

    let completed = false;

        // Configs
        let attempts = 0;
    const maxAttempts = 5;
        const timeouts = {
            init: 100,
            cart: 100,
            rerun: 100,
        };

        await sleep(timeouts.init);

    while (!completed) {
      try {
        while (attempts < maxAttempts) {
                    attempts++;
          console.log(\`🔁 Attempt \${attempts}/\${maxAttempts}: adding item -> \${item?.alias || item.name}\`);

          await gql('updateItems', HASHES.updateItems, 'mutation', 'POST', getUpdateVariables(item));
          await sleep(timeouts.cart);

                    const currentQty = await checkCart(item.id);

                    console.log('🎯	Target Quantity:', item.qty);
                    console.log('🛒 Cart Quantity:', currentQty);

          // Already added successfully
          if (currentQty === item.qty) {
            completed = true;
            break;
          }
        }

                if (attempts >= maxAttempts) {
                    completed = true;
                }

      } catch (err) {

                if (attempts >= maxAttempts) {
                    console.error(\`💥 Error processing \${item?.alias || item.name}: Max attempts reached for \${item?.alias || item.name}\n\`, { cause: err });
                    break;

                } else if (!completed) {
                    console.warn(\`⚠️ Error processing \${item?.alias || item.name}: Failed to add \${item?.alias || item.name} to cart\n\`, { cause: err });
                    console.log(\`🔄 Retrying item in \${timeouts.rerun / 1000} seconds...\`);

                }

                await sleep(timeouts.rerun);
      }
      }
        (completed && !(attempts >= maxAttempts)) 
            ? console.log(\`✅ \${item?.alias || item.name} (\${item.id}) ×\${item.qty}\`) 
            : console.log(\`❌ \${item?.alias || item.name} (\${item.id}) ×\${item.qty}\`)
    }

  console.log('🎉 Done');
})().then(res => console.log(res)).catch(console.error);`);
        // Finale once it's done; error buzz if nothing could be loaded
        // (empty list, or every URL failed).
        if (res?.length) playFinale();
        else playError();
        return res; // lint rule promise/always-return wants a return value
      })
      // Re-enable the button whether it succeeded or failed. Placed before
      // .catch because the lint rule wants every chain to end in a catch.
      .finally(() => setProgress(null))
      .catch((error: unknown) => {
        // e.g. a request failed or the verification window was closed.
        // Errors from the main process arrive prefixed with
        // "Error invoking remote method 'get-product':".
        console.error(
          'Failed to load products:',
          error instanceof Error ? error.message : error,
        );
        playError();
      });
  };

  return (
    <div
      className={[
        'container',
        resetting && 'isResetting', // reset out
        justReset && !resetting && 'isFresh', // back in after a reset
      ]
        .filter(Boolean)
        .join(' ')}
      onAnimationEnd={(e) => {
        // Child animations bubble up here too; only react to the reset-out.
        if (e.target === e.currentTarget && e.animationName === 'resetOut') {
          onReset();
        }
      }}
    >
      <Header />

      <UrlForm
        qty={qty}
        onQtyChange={setQty}
        alias={aliasInput}
        onAliasChange={setAliasInput}
        url={urlInput}
        onUrlChange={changeUrlInput}
        error={urlError}
        inputAnim={inputAnim}
        onInputAnimEnd={clearInputAnim}
        onSubmit={addUrl}
      />

      <ListDialog dialogRef={listDialog} urls={urls} onRemove={removeUrl} />

      <ActionBar
        count={urls.length}
        addCount={addCount}
        onOpenList={() => listDialog.current?.showModal()}
        onGenerate={updateProducts}
        progress={progress}
        onReset={handleReset}
        canReset={canReset}
        resetting={resetting}
      />

      <RunStatus progress={progress} />

      <OutputPanel value={output} busy={busy} />
    </div>
  );
}
