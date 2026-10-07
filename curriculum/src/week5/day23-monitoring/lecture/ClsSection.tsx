import { ClsDemosHeader } from "./ClsHeader";
import { Compare } from "./Compare";
import { ShiftyBanner, ShiftyImage, StableBanner, StableImage } from "./ClsDemos";

export function ClsDemos() {
  return (
    <>
      <h2 className="fe-title">Improving CLS: the page jumps around</h2>
      <ClsDemosHeader />

      <Compare
        replay
        title="1 · A banner that arrives late"
        hint="Press Replay and watch the product list and the Buy button. Left: they jump down. Right: nothing moves."
        before={{
          demo: <ShiftyBanner />,
          marks: [2],
          code: `// arrives late and pushes everything down
{ready && <div className="banner">Summer sale</div>}
<Products />`,
        }}
        after={{
          demo: <StableBanner />,
          marks: [1, 2],
          code: `<div style={{ height: 72 }}>   // reserve the space first
  {ready ? <Banner /> : <Skeleton />}
</div>
<Products />`,
        }}
      />

      <Compare
        replay
        title="2 · An image with no size"
        hint="Press Replay. Left: the image is 0px tall until it arrives, then everything below jumps."
        before={{
          demo: <ShiftyImage />,
          marks: [1],
          code: `<img src={src} alt="Summer sale" />   // no size: the browser can't reserve a box`,
        }}
        after={{
          demo: <StableImage />,
          marks: [2],
          code: `<img src={src} alt="Summer sale"
     style={{ width: "100%", aspectRatio: "5 / 2" }} />   // reserves the box first`,
        }}
      />
    </>
  );
}
