import { Badge } from "@repo/shadcn/components/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/shadcn/components/Card";
import { Separator } from "@repo/shadcn/components/Separator";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/about/")({ component: AboutPage });

const FRONTEND_STACK = [
  "TanStack Start",
  "TanStack Router",
  "TanStack Query",
  "React 19",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Paraglide JS",
];

const BACKEND_STACK = ["Elysia", "Effect", "Prisma", "Eden Treaty", "Zod"];

const TOOLING_STACK = ["Turborepo", "Bun", "Biome", "TypeScript"];

const PrincipleCard = React.memo(function PrincipleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
});

PrincipleCard.displayName = "PrincipleCard";

const StackSection = React.memo(function StackSection({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
});

StackSection.displayName = "StackSection";

function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {m.about_title()}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {m.about_description()}
        </p>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-bold">{m.about_stack_title()}</h2>
        <Card className="mt-6">
          <CardContent className="grid gap-8 sm:grid-cols-3">
            <StackSection
              label={m.about_stack_frontend()}
              items={FRONTEND_STACK}
            />
            <StackSection
              label={m.about_stack_backend()}
              items={BACKEND_STACK}
            />
            <StackSection
              label={m.about_stack_tooling()}
              items={TOOLING_STACK}
            />
          </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-bold">{m.about_philosophy_title()}</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {m.about_philosophy_description()}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <PrincipleCard
            title={m.about_principles_correctness()}
            description={m.about_principles_correctness_description()}
          />
          <PrincipleCard
            title={m.about_principles_dx()}
            description={m.about_principles_dx_description()}
          />
          <PrincipleCard
            title={m.about_principles_performance()}
            description={m.about_principles_performance_description()}
          />
        </div>
      </section>
    </main>
  );
}
