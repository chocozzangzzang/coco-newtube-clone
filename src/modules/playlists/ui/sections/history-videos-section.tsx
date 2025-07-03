"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const HistoryVideosSection = () => {
    return (
        <Suspense fallback={<HistoryVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error.....</p>}>
                <HistoryVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const HistoryVideosSectionSkeleton = () => {
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

const HistoryVideosSectionSuspense = () => {

    const [ videos, query ] = trpc.playlists.getHistory.useSuspenseInfiniteQuery(
        { limit : DEFAULT_LIMIT } , 
        { getNextPageParam : (lastPage) => lastPage.nextCursor }
    )

    return (
        <div>
            <div className="flex flex-col gap-4 gpa-y-10 md:hidden">
                { videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoGridCard key={video.id} data={video} />
                    ))
                }
            </div>
            <div className="flex flex-col gap-4 md:flex">
                { videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoCard key={video.id} data={video} size="compact"/>
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