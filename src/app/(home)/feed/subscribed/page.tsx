import { DEFAULT_LIMIT } from "@/constants";
import { SubscribeView } from "@/modules/home/ui/views/subscribe-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = () => {
  void trpc.videos.getManySubscribed.prefetchInfinite({ limit: DEFAULT_LIMIT })

  return (
    <HydrateClient>
      <SubscribeView />
    </HydrateClient>
  );
}

export default Page;
