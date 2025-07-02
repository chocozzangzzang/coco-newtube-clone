import { DEFAULT_LIMIT } from "@/constants";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>
}

const Page = async ({ searchParams } : PageProps) => {
  const { categoryId } = await searchParams; // use categoryId

  void trpc.categories.getMany.prefetch(); // prefetch categories
  void trpc.videos.getMany.prefetchInfinite({ categoryId, limit: DEFAULT_LIMIT})

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId}/>
    </HydrateClient>
  );
}

export default Page;
