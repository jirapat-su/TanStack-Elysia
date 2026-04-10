import { Badge } from "@repo/shadcn/components/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/shadcn/components/Card";
import React from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Displays an API response as formatted JSON inside a card.
 *
 * @param title - The endpoint path (e.g. "/server/health")
 * @param method - HTTP method badge label
 * @param data - Response payload to render as pretty-printed JSON
 */
const ResponseBlock = React.memo(function ResponseBlock({
  title,
  method = "GET",
  data,
}: {
  title: string;
  method?: HttpMethod;
  data: unknown;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {title}
          <Badge variant="outline" className="font-mono text-xs">
            {method}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
});

ResponseBlock.displayName = "ResponseBlock";

export default ResponseBlock;
