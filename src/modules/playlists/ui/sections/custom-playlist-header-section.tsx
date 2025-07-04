"use client"

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface CustomPlaylistHeaderSectionProps {
    playlistId: string;
}

export const CustomPlaylistHeaderSection = ({playlistId} : CustomPlaylistHeaderSectionProps) => {
    return (
        <Suspense fallback={<CustomPlaylistHeaderSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error.....</p>}>
                <CustomPlaylistHeaderSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const CustomPlaylistHeaderSectionSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24"/>
            <Skeleton className="h-4 w-32"/>
        </div>
    )
}

const CustomPlaylistHeaderSectionSuspense = ({playlistId} : CustomPlaylistHeaderSectionProps) => {
    const [ playlist ] = trpc.playlists.getOnePlaylist.useSuspenseQuery({ id : playlistId });
    const utils = trpc.useUtils();
    const router = useRouter();
    const remove = trpc.playlists.remove.useMutation({
        onSuccess: () => {
            toast.success("Playlist removed!!");
            utils.playlists.getMany.invalidate();
            router.push("/playlists");
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    })
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-xs text-muted-foreground">
                    Videos from the playlist
                </p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => remove.mutate({id : playlistId})}
                disabled={remove.isPending}
            >
                <Trash2Icon />
            </Button>
        </div>
    )
}