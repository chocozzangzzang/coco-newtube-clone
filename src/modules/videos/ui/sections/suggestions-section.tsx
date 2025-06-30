"use client"

import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { VideoCard } from "../components/video-row-card";
import { VideoGridCard } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface SuggetionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestsSection = ({ videoId, isManual } : SuggetionsSectionProps) => {
  
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