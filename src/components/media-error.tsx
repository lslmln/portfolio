import { ImageBrokenIcon } from "@phosphor-icons/react";
import { ICON_SIZE_SM } from "@/lib/icon-size";

export function MediaError() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ImageBrokenIcon size={ICON_SIZE_SM} weight="regular" className="text-content-secondary" />
    </div>
  );
}
