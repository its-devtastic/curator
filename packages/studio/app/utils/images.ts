import { MediaItem } from "@curatorjs/types";

export function getDefaultImageUrl(image: MediaItem) {
  return (
    image.formats?.thumbnail?.url ||
    image.formats?.small?.url ||
    image.formats?.medium?.url ||
    image.formats?.large?.url ||
    image.url
  );
}
