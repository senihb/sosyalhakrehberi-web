import type {
  ToolAnalyticsEvent,
  ToolAnalyticsTargetKind,
  ToolAnalyticsTool,
  ToolAnalyticsSurface,
} from "./analytics.ts";
import type { EligibilityStatus } from "./types.ts";

export type ToolAnalyticsSession = {
  trackOpened: () => void;
  trackFormStarted: () => void;
  trackFormSubmitted: () => void;
  trackResultReceived: (decisionId: string, status: EligibilityStatus) => void;
  trackLinkClick: (
    surface: ToolAnalyticsSurface,
    targetKind: ToolAnalyticsTargetKind,
    targetHref: string,
  ) => void;
};

type ToolAnalyticsTracker = (event: ToolAnalyticsEvent) => void;

export function createToolAnalyticsSession(
  tool: ToolAnalyticsTool,
  tracker: ToolAnalyticsTracker,
): ToolAnalyticsSession {
  let hasTrackedOpen = false;
  let hasTrackedFormStart = false;
  let lastDecisionId: string | null = null;

  return {
    trackOpened() {
      if (hasTrackedOpen) {
        return;
      }

      hasTrackedOpen = true;
      tracker({
        name: "tool_opened",
        tool,
        surface: "tool-page",
      });
    },

    trackFormStarted() {
      if (hasTrackedFormStart) {
        return;
      }

      hasTrackedFormStart = true;
      tracker({
        name: "form_started",
        tool,
        surface: "tool-page",
      });
    },

    trackFormSubmitted() {
      tracker({
        name: "form_submitted",
        tool,
        surface: "tool-page",
      });
    },

    trackResultReceived(decisionId, status) {
      if (!decisionId || lastDecisionId === decisionId) {
        return;
      }

      lastDecisionId = decisionId;
      tracker({
        name: "result_received",
        tool,
        surface: "result",
        status,
      });
    },

    trackLinkClick(surface, targetKind, targetHref) {
      tracker({
        name: "guide_link_clicked",
        tool,
        surface,
        target_kind: targetKind,
        target_href: targetHref,
      });
    },
  };
}

