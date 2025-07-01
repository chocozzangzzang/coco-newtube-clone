import React from 'react'
import { Homelayout } from '@/modules/home/ui/layouts/home-layout'

interface LayoutProps {
    children : React.ReactNode
}

export const dynamic = "force-dynamic";

const layout = ({ children } : LayoutProps) => {
    return (
        <Homelayout>
            {children}
        </Homelayout>
    )
}

export default layout