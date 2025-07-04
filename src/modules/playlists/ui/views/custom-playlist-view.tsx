import { CustomPlaylistSection } from "../sections/custom-playlist-section";
import { CustomPlaylistHeaderSection } from "../sections/custom-playlist-header-section";

interface PageProps {
    playlistId: string;
}

export const CustomPlaylistView = ({ playlistId } : PageProps) => {
    
    return (
        <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <CustomPlaylistHeaderSection playlistId={playlistId} />
            <CustomPlaylistSection playlistId={playlistId}/>
        </div>
    )
}