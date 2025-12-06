import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';

// Default policies if none exist
export async function GET() {
    try {
        const policiesRef = collection(db, 'policies');
        const snapshot = await getDocs(policiesRef);

        const policies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(policies);
    } catch (error) {
        console.error("Error fetching policies:", error);
        return NextResponse.json([]);
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, enabled } = body;

        if (!id || typeof enabled === 'undefined') {
            return NextResponse.json({ error: 'Missing id or enabled state' }, { status: 400 });
        }

        // Persist to Firebase
        // We use setDoc with merge to create or update
        await setDoc(doc(db, 'policies', id), { enabled }, { merge: true });

        return NextResponse.json({ success: true, id, enabled });
    } catch (error) {
        console.error("Error saving policy:", error);
        return NextResponse.json({ error: 'Failed to save policy' }, { status: 500 });
    }
}
