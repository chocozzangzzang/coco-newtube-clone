import { DEFAULT_LIMIT } from "@/constants";
import { CustomPlaylistView } from "@/modules/playlists/ui/views/custom-playlist-view";
import { HistoryView } from "@/modules/playlists/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ playlistId : string }>;
}

const Page = async ({ params } : PageProps) => {
    const { playlistId } = await params;

    void trpc.playlists.getOnePlaylist.prefetch({ id : playlistId });
    void trpc.playlists.getCustomPlaylist.prefetchInfinite({ playlistId, limit : DEFAULT_LIMIT})

    return (
        <HydrateClient>
            <CustomPlaylistView playlistId={playlistId} />
        </HydrateClient>
    );
}

export default Page;