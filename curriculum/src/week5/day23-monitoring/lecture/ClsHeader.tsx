// What a layout shift looks like (video from web.dev), shown above the CLS demos.
export function ClsDemosHeader() {
  return (
    <figure className="fe-video">
      <video
        src="https://web.dev/static/articles/cls/video/web-dev-assets/layout-instability-api/layout-instability2.webm"
        controls
        muted
        loop
        autoPlay
        playsInline
      />
      <figcaption>Layout shifts, as a user sees them (web.dev)</figcaption>
    </figure>
  );
}
