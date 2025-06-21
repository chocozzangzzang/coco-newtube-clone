import React from 'react'
import { Homelayout } from '@/modules/home/ui/layouts/home-layout'

interface LayoutProps {
    children : React.ReactNode
}

const layout = ({ children } : LayoutProps) => {
    return (
        <Homelayout>
            {children}
        </Homelayout>
    )
}

export default layout