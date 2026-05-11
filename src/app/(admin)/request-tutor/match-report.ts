export type MatchBlockSummary = {
  label: string;
  matchedCount: number;
};

export type MatchReportSummary = {
  adminEmail?: string;
  message?: string;
  blocks: MatchBlockSummary[];
};

const unwrapRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object") {
    return {};
  }

  const record = value as Record<string, unknown>;

  if (record.data && typeof record.data === "object") {
    return record.data as Record<string, unknown>;
  }

  if (record.result && typeof record.result === "object") {
    return record.result as Record<string, unknown>;
  }

  return record;
};

export const normalizeTutorMatchReportSummary = (
  response: unknown,
): MatchReportSummary => {
  const record = unwrapRecord(response);
  const adminRecord =
    record.admin && typeof record.admin === "object"
      ? (record.admin as Record<string, unknown>)
      : undefined;

  const adminEmail =
    typeof record.adminEmail === "string"
      ? record.adminEmail
      : typeof record.admin_email === "string"
        ? record.admin_email
        : typeof record.email === "string"
          ? record.email
          : typeof record.generatedByEmail === "string"
            ? record.generatedByEmail
            : typeof adminRecord?.email === "string"
              ? String(adminRecord.email)
              : undefined;

  const rawBlocks =
    (Array.isArray(record.blocks) && record.blocks) ||
    (Array.isArray(record.matchBlocks) && record.matchBlocks) ||
    (Array.isArray(record.tutorBlocks) && record.tutorBlocks) ||
    (Array.isArray(record.results) && record.results) ||
    [];

  const blocks = rawBlocks.map((block, index) => {
    const blockRecord =
      block && typeof block === "object"
        ? (block as Record<string, unknown>)
        : {};

    const matchedTutors =
      (Array.isArray(blockRecord.matchedTutors) && blockRecord.matchedTutors) ||
      (Array.isArray(blockRecord.matches) && blockRecord.matches) ||
      (Array.isArray(blockRecord.tutors) && blockRecord.tutors) ||
      [];

    const matchedCount =
      Number(blockRecord.matchedCount) ||
      Number(blockRecord.count) ||
      Number(blockRecord.totalMatchedTutors) ||
      matchedTutors.length ||
      0;

    const labelSource =
      typeof blockRecord.subject === "string"
        ? blockRecord.subject
        : typeof blockRecord.subjectTitle === "string"
          ? blockRecord.subjectTitle
          : typeof blockRecord.title === "string"
            ? blockRecord.title
            : typeof blockRecord.name === "string"
              ? blockRecord.name
              : typeof blockRecord.blockName === "string"
                ? blockRecord.blockName
                : undefined;

    return {
      label: labelSource ? String(labelSource) : `Block ${index + 1}`,
      matchedCount,
    };
  });

  return {
    adminEmail,
    message: typeof record.message === "string" ? record.message : undefined,
    blocks,
  };
};

export const formatTutorMatchReportSummaryText = (
  summary: MatchReportSummary,
): string => {
  const parts: string[] = [];

  if (summary.adminEmail) {
    parts.push(`Admin: ${summary.adminEmail}`);
  }

  if (summary.blocks.length > 0) {
    parts.push(
      summary.blocks
        .map((block) => `${block.label}: ${block.matchedCount}`)
        .join(", "),
    );
  }

  if (summary.message) {
    parts.push(summary.message);
  }

  return parts.join(" | ");
};
