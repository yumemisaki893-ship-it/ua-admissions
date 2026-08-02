"use client";

import { create } from "zustand";

interface UiState {
  mobileNavOpen: boolean;
  announcementOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setAnnouncementOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  announcementOpen: true,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  setAnnouncementOpen: (open) => set({ announcementOpen: open }),
}));
