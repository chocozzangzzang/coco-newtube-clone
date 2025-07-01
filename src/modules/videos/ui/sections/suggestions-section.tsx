"use client"

import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { VideoCard, VideoRowCardSkeleton } from "../components/video-row-card";
import { VideoGridCard } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuggetionSectionProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestionSection = ({
  videoId,
  isManual,
} : SuggetionSectionProps) => {
  return (
    <Suspense fallback={<SuggetionSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SuggestionSectionSuspense videoId={videoId} isManual={isManual}/>
      </ErrorBoundary>
    </Suspense>
  )
}

const SuggetionSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length : 6}).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact"/>
        ))}
      </div>
      <div className="block md:hidden space-y-10">
          {Array.from({ length : 6}).map((_, index) => (
            <VideoRowCardSkeleton key={index}/>
          ))}
      </div>
    </>
  )
}

const SuggestionSectionSuspense = ({ videoId, isManual } : SuggetionSectionProps) => {
  
  const [ suggestions, query ] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
    videoId,
    limit : DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) => page.items.map((suggestion) => (
          <VideoCard 
            key={suggestion.id}
            data={suggestion}
            size="compact"
          />
        )))}
      </div>
      <div className="black md:hidden space-y-10">
        {suggestions.pages.flatMap((page) => page.items.map((suggestion) => (
          <VideoGridCard 
            key={suggestion.id}
            data={suggestion}
          />
        )))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isManual={isManual}
      />
    </>
  )
}