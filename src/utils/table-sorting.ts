type TimestampedRecord = {
  createdAt?: string | null;
  updatedAt?: string | null;
};

const getTimestamp = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getLatestTimestamp = (item: unknown) => {
  if (!item || typeof item !== "object") {
    return 0;
  }

  const timestampedItem = item as TimestampedRecord;
  return (
    getTimestamp(timestampedItem.updatedAt) ??
    getTimestamp(timestampedItem.createdAt) ??
    0
  );
};

export const sortByLatestTimestampDesc = <T>(items: readonly T[]) =>
  items
    .map((item, index) => ({ item, index }))
    .sort((first, second) => {
      const timestampDifference =
        getLatestTimestamp(second.item) - getLatestTimestamp(first.item);

      return timestampDifference || first.index - second.index;
    })
    .map(({ item }) => item);
