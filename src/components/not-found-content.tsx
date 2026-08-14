import { ErrorMessage, ReloadButton } from "./error-message";

export function NotFoundContent() {
  return (
    <div
      className="flex items-center px-page-x"
      style={{ minHeight: "calc(100svh - var(--nav-height) - var(--footer-height))" }}
    >
      <ErrorMessage message="Oops, something went wrong.">
        <ReloadButton />
      </ErrorMessage>
    </div>
  );
}
