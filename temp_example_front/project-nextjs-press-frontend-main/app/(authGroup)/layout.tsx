import { Navbar } from '@/components/shared/navbar';
import { getMe } from '@/service/getMe';
import type { ReactNode } from 'react';

const AuthGrouplayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getMe();

    return (
        <div>
            <Navbar user={user} />
            <div className='max-w-7xl mx-auto'>
                {children}
            </div>
        </div>
    );
};

export default AuthGrouplayout;
