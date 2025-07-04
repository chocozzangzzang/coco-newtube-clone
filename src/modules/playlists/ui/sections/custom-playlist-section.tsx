"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface CustomPlaylistProps {
    playlistId: string;
}

export const CustomPlaylistSection = (props : CustomPlaylistProps) => {
    return (
        <Suspense fallback={<CustomPlaylistSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error.....</p>}>
                <CustomPlaylistSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}

const CustomPlaylistSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 md:hidden">
               {Array.from({ length : 18 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index}/>
                ))}
            </div>
            <div className="hidden flex-col gap-4 gpa-y-10 md:flex">
               {Array.from({ length : 18 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} size="compact"/>
                ))}
            </div>
        </div>
    )
}

const CustomPlaylistSectionSuspense = ({playlistId} : CustomPlaylistProps) => {
    const utils = trpc.useUtils();
    const [ videos, query ] = trpc.playlists.getCustomPlaylist.useSuspenseInfiniteQuery(
        { limit : DEFAULT_LIMIT, playlistId } , 
        { getNextPageParam : (lastPage) => lastPage.nextCursor }
    )

    const removeVideo = trpc.playlists.removeVideo.useMutation({
            onSuccess: (data) => {
                toast.success("Video deleted to playlist!!");
                utils.playlists.getMany.invalidate();
                utils.playlists.getManyForVideo.invalidate({ videoId : data.videoId });
                utils.playlists.getOnePlaylist.invalidate({ id : data.playlistId });
                utils.playlists.getCustomPlaylist.invalidate({ playlistId : data.playlistId });
                // TODO : invalidate playlists.getOne
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })

    return (
        <div>
            <div className="flex flex-col gap-4 gpa-y-10 md:hidden">
                { videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoGridCard key={video.id} data={video} 
                        onRemove={() => removeVideo.mutate({playlistId, videoId: video.id})}/>
                    ))
                }
            </div>
            <div className="flex flex-col gap-4 md:flex">
                { videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoCard key={video.id} data={video} size="compact"
                        onRemove={() => removeVideo.mutate({playlistId, videoId: video.id})} />
                    ))
                }
            </div>
            <InfiniteScroll 
                isFetchingNextPage={query.isFetchingNextPage}
                hasNextPage={query.hasNextPage}
                fetchNextPage={query.fetchNextPage}
            />   
        </div>
    )
}