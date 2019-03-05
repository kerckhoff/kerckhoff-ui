import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const configuredDayJs = dayjs;

export type PackageSetItemType = "image" | "text";

export const mimeTypeToType = (mimetype: string): PackageSetItemType => {
  if (mimetype.startsWith("image")) {
    return "image";
  } else {
    return "text";
  }
};
