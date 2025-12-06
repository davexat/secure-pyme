import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId') || 'block_programs'; // Default to the main demo policy

    try {
        const policyRef = doc(db, 'policies', policyId);
        const policySnap = await getDoc(policyRef);

        let isBlocked = false;

        if (policySnap.exists()) {
            isBlocked = policySnap.data().enabled === true;
        } else {
            // If policy doesn't exist in DB, check defaults logic (fallback)
            if (policyId === 'block_programs') isBlocked = false; // Default off
        }

        return NextResponse.json({
            allowed: !isBlocked,
            policyId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error checking policy:", error);
        // Fail safe: allow if check fails? Or block? 
        // Security best practice: Fail Closed (block). But for UX demo maybe Fail Open.
        // Let's Fail Open (Allowed) for demo to avoid frustration if DB config is bad.
        return NextResponse.json({ allowed: true, error: 'Check failed, defaulting to allow' });
    }
}
