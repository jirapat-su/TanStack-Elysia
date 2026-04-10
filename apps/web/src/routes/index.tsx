import { Badge } from "@repo/shadcn/components/Badge";
import { Button } from "@repo/shadcn/components/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/shadcn/components/Card";
import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useCallback } from "react";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/")({ component: HomePage });

const FeatureCard = React.memo(function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-foreground/20">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
});

FeatureCard.displayName = "FeatureCard";

function HomePage() {
  const handleGitHubClick = useCallback(() => {
    window.open("https://github.com", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <section className="flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4">
          {m.home_hero_badge()}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {m.home_title()}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          {m.home_description()}
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link to="/about">{m.home_cta_get_started()}</Link>
          </Button>
          <Button variant="outline" size="lg" onClick={handleGitHubClick}>
            {m.home_cta_github()}
          </Button>
        </div>
      </section>

      <section className="mt-20 grid gap-4 sm:grid-cols-2">
        <FeatureCard
          title={m.home_feature_routing_title()}
          description={m.home_feature_routing_description()}
        />
        <FeatureCard
          title={m.home_feature_api_title()}
          description={m.home_feature_api_description()}
        />
        <FeatureCard
          title={m.home_feature_ui_title()}
          description={m.home_feature_ui_description()}
        />
        <FeatureCard
          title={m.home_feature_i18n_title()}
          description={m.home_feature_i18n_description()}
        />
      </section>
    </main>
  );
}
