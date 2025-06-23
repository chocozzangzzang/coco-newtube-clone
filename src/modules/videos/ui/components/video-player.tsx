"use client"

import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayProps{
    playbackId?: string | null | undefined;
    thumbnailUrl?: string | null | undefined;
    autoPlay?: boolean;
    onPlay?: () => void;
};

export const VideoPlayer = ({
    playbackId,
    thumbnailUrl,
    autoPlay,
    onPlay
}:VideoPlayProps) => {
    if(!playbackId) return null;

    return (
        <MuxPlayer 
            playbackId={playbackId}
            poster={thumbnailUrl || "/placeholder.svg"}
            playerInitTime={0}
            autoPlay={autoPlay}
            thumbnailTime={0}
            className="w-full h-full object-contain"
            accentColor="#FF2056"
            onPlay={onPlay}
        />
    );
};

