import { Separator } from "@repo/shadcn/components/Separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getServerHealthQueryOptions } from "./-api/useGetServerHealth";
import { getServerInfoQueryOptions } from "./-api/useGetServerInfo";
import ResponseBlock from "./-components/ResponseBlock";

export const Route = createFileRoute("/example/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(getServerHealthQueryOptions()),
      context.queryClient.ensureQueryData(getServerInfoQueryOptions()),
    ]),
  component: ExamplePage,
});

function ExamplePage() {
  const { data: healthData } = useSuspenseQuery(getServerHealthQueryOptions());
  const { data: infoData } = useSuspenseQuery(getServerInfoQueryOptions());

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          API Example
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Example usage of Eden Treaty API client with end-to-end type safety.
        </p>
      </section>

      <Separator className="my-12" />

      <div className="grid gap-6">
        <ResponseBlock title="/server/health" data={healthData} />
        <ResponseBlock title="/server/info" data={infoData} />
      </div>
    </main>
  );
}
