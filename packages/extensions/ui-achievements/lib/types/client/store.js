/**
 * Achievements client store: transient viewing state shared across the toast
 * stack, sidebar trophy, gallery overlay, and composer dock. The Host stays
 * the single fact source — the apply world polls the achievements Remote and
 * feeds this store, components read through the bound selector hook.
 */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
/** Toast retention window before a card auto-dismisses. */
const TOAST_TTL_MS = 7000;
/** The achievements client controller (one per client plugin apply). */
export class AchievementsStore {
    /** The snapshot the surfaces render from (uSES-safe store). */
    store = createSnapshotStore({
        dock: null,
        toasts: [],
        newCount: 0,
        galleryOpen: false,
    });
    /** Fold a host dock snapshot and a batch of fresh unlocks into the store. */
    ingest(dock, unlocks) {
        const now = Date.now();
        this.store.update((s) => {
            s.dock = dock;
            const retained = s.toasts.filter(t => now - t.clientAt < TOAST_TTL_MS);
            const fresh = unlocks.map(u => ({ ...u, clientAt: now }));
            s.toasts = [...retained, ...fresh].slice(-5);
            s.newCount = s.newCount + fresh.length;
        });
    }
    /** Drop every toast whose TTL has elapsed (the poll tick prunes them). */
    prune() {
        const now = Date.now();
        this.store.update((s) => {
            s.toasts = s.toasts.filter(t => now - t.clientAt < TOAST_TTL_MS);
        });
    }
    /** Remove one toast by identity (dismiss button). */
    dismiss(clientAt) {
        this.store.update((s) => {
            s.toasts = s.toasts.filter(t => t.clientAt !== clientAt);
        });
    }
    /** Toggle the gallery overlay; opening it clears the unread badge. */
    toggleGallery() {
        this.store.update((s) => {
            s.galleryOpen = !s.galleryOpen;
            if (s.galleryOpen)
                s.newCount = 0;
        });
    }
    /** Close the gallery overlay. */
    closeGallery() {
        this.store.update((s) => {
            s.galleryOpen = false;
        });
    }
}
//# sourceMappingURL=store.js.map