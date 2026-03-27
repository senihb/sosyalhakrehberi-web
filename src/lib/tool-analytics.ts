import { trackAnalyticsEvent, type ToolAnalyticsTool } from "@/lib/analytics";
import {
  createToolAnalyticsSession as createCoreToolAnalyticsSession,
  type ToolAnalyticsSession,
} from "@/lib/tool-analytics-core";

export type { ToolAnalyticsSession } from "@/lib/tool-analytics-core";

export function createToolAnalyticsSession(tool: ToolAnalyticsTool): ToolAnalyticsSession {
  return createCoreToolAnalyticsSession(tool, trackAnalyticsEvent);
}

