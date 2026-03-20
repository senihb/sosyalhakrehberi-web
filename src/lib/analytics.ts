import type { EligibilityStatus } from "@/lib/types";

export type ToolAnalyticsTool = "home-care" | "gss" | "old-age";
export type ToolAnalyticsSurface = "tool-page" | "result" | "guidance";
export type ToolAnalyticsTargetKind = "guide" | "tool" | "primary-action";

export type ToolAnalyticsEvent =
  | {
      name: "tool_opened";
      tool: ToolAnalyticsTool;
      surface: "tool-page";
    }
  | {
      name: "form_started";
      tool: ToolAnalyticsTool;
      surface: "tool-page";
    }
  | {
      name: "form_submitted";
      tool: ToolAnalyticsTool;
      surface: "tool-page";
    }
  | {
      name: "result_received";
      tool: ToolAnalyticsTool;
      surface: "result";
      status: EligibilityStatus;
    }
  | {
      name: "guide_link_clicked";
      tool: ToolAnalyticsTool;
      surface: ToolAnalyticsSurface;
      target_kind: ToolAnalyticsTargetKind;
      target_href: string;
    };

export type AnalyticsEnvelope = {
  event: ToolAnalyticsEvent["name"];
  tool: ToolAnalyticsTool;
  surface: ToolAnalyticsSurface;
  status?: EligibilityStatus;
  target_kind?: ToolAnalyticsTargetKind;
  target_href?: string;
};

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, string>>;
};

export function buildAnalyticsEnvelope(event: ToolAnalyticsEvent): AnalyticsEnvelope {
  const baseEnvelope: AnalyticsEnvelope = {
    event: event.name,
    tool: event.tool,
    surface: event.surface,
  };

  if (event.name === "result_received") {
    return {
      ...baseEnvelope,
      status: event.status,
    };
  }

  if (event.name === "guide_link_clicked") {
    return {
      ...baseEnvelope,
      target_kind: event.target_kind,
      target_href: event.target_href,
    };
  }

  return baseEnvelope;
}

export function trackAnalyticsEvent(event: ToolAnalyticsEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  const envelope = buildAnalyticsEnvelope(event);
  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dispatchEvent(
    new CustomEvent<AnalyticsEnvelope>("shr:analytics", {
      detail: envelope,
    }),
  );

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push(
      Object.fromEntries(
        Object.entries(envelope).filter((entry): entry is [string, string] => {
          const [, value] = entry;
          return typeof value === "string";
        }),
      ),
    );
  }
}
