import React from 'react'
import { StudioLayout } from '@/modules/studio/ui/layouts/studio-layout'

interface LayoutProps {
    children : React.ReactNode
}

export const dynamic = "force-dynamic";

const layout = ({ children } : LayoutProps) => {
    return (
        <StudioLayout>
            {children}
        </StudioLayout>
    )
}

export default layout