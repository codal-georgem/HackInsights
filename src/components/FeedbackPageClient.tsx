"use client";

import { useState, useMemo, useEffect } from "react";
import { client } from "@/lib/sanity.config";
import FeedbackWall, { type FeedbackItem } from "./FeedbackWall";
import FeedbackModal from "./FeedbackModal";
import OrganizersModal from "./OrganizersModal";
import Header from "./Header";
import OrganizersSection from "./OrganizersSection";
import { triggerCelebration } from "./CelebrationBurst";

type Props = {
  initialItems: FeedbackItem[];
};

export default function FeedbackPageClient({ initialItems }: Props) {
  // Merge real items with dummy items for testing
  const [items, setItems] = useState<FeedbackItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrganizersOpen, setIsOrganizersOpen] = useState(false);
  const [newestId, setNewestId] = useState<string | null>(null);
  
  // Infinite Scroll & Search State
  const [displayCount, setDisplayCount] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  // Real-time updates from Sanity
  useEffect(() => {
      // Listen for new feedback items
      const subscription = client
        .listen<FeedbackItem>(`*[_type == "feedback"]`, {}, { visibility: "query" })
        .subscribe((update) => {
          if (update.type !== "mutation") return;

          if (update.transition === "appear") {
            const newItem = update.result;
            if (!newItem) return;

            setItems((prev) => {
              // Check if we already have this ID
              if (prev.some((item) => item._id === newItem._id)) return prev;

              // Filter out any matching optimistic items
              const withoutOptimistic = prev.filter((p) => {
                // Keep real items
                if (!p._id.startsWith("optimistic-")) return true;

                // For optimistic items, check if they match the new item
                
                // Compare message (normalized)
                const pMsg = (p.message || "").trim().replace(/\s+/g, " "); // Normalize whitespace
                const nMsg = (newItem.message || "").trim().replace(/\s+/g, " ");
                if (pMsg !== nMsg) return true; // Message doesn't match, keep it

                // Compare name (normalized)
                // Treat undefined/null/empty string as equivalent ("")
                const pName = (p.name || "").trim();
                const nName = (newItem.name || "").trim();
                if (pName !== nName) return true; // Name doesn't match, keep it

                // Compare timestamp (loose)
                const pTime = new Date(p.submittedAt).getTime();
                const nTime = new Date(newItem.submittedAt || 0).getTime();
                const diff = Math.abs(pTime - nTime);
                
                // If it matches content closely and time loosely (within 5 mins), it's the same item.
                // We want to remove it (return false) so it gets replaced by the real one.
                if (diff < 300000) return false;

                return true;
              });

              return [newItem, ...withoutOptimistic];
            });

            setNewestId(newItem._id);
            setTimeout(() => setNewestId(null), 900);
          } else if (update.transition === "disappear") {
            const documentId = update.documentId;
            setItems((prev) => prev.filter((item) => item._id !== documentId));
          } else if (update.transition === "update") {
             const updatedItem = update.result;
             if (!updatedItem) return;
             
             setItems((prev) => prev.map((item) => 
               item._id === updatedItem._id ? updatedItem : item
             ));
          }
        });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function handleNewFeedback(message: string, name: string | undefined, rating: number) {
    const id = `optimistic-${Date.now()}`;
    const optimistic: FeedbackItem = {
      _id: id,
      message,
      name,
      rating,
      submittedAt: new Date().toISOString(),
    };

    setItems((prev) => {
      // Check if this item already exists (came in from real-time listener before our API call returned)
      // This prevents the case where the real item arrives BEFORE we add the optimistic one
      const alreadyExists = prev.some((p) => {
        // Must be a real item (not optimistic)
        if (p._id.startsWith("optimistic-")) return false;

        // Content match
        const pMsg = (p.message || "").trim().replace(/\s+/g, " ");
        const nMsg = (message || "").trim().replace(/\s+/g, " ");
        if (pMsg !== nMsg) return false;

        const pName = (p.name || "").trim();
        const nName = (name || "").trim();
        if (pName !== nName) return false;

        // Time match (very recent)
        // Check if the item submittedAt is close to NOW
        const pTime = new Date(p.submittedAt).getTime();
        const nTime = new Date().getTime(); 
        const diff = Math.abs(pTime - nTime);
        
        // If it arrived within last 60 seconds, it's definitely the one we just sent
        return diff < 60000;
      });

      if (alreadyExists) return prev;

      return [optimistic, ...prev];
    });

    setNewestId(id);
    triggerCelebration();

    // Reset search so the new item is visible immediately if user was searching
    setSearchTerm("");
    
    // Scroll to top to ensure user sees their new feedback
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollableDiv = document.getElementById('scrollableDiv');
    if (scrollableDiv) {
      scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Extended to match card-launch animation duration
    setTimeout(() => setNewestId(null), 900);
  }

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lowerTerm = searchTerm.toLowerCase();
    return items?.filter(item => 
      item.message.toLowerCase().includes(lowerTerm) || 
      (item.name && item.name.toLowerCase().includes(lowerTerm))
    );
  }, [items, searchTerm]);

  // Only show the subset for infinite scroll
  const visibleItems = filteredItems.slice(0, displayCount);
  const hasMore = visibleItems.length < filteredItems.length;

  const loadMore = () => {
    // Artificial delay for better UX if needed, or just set immediately
    setTimeout(() => {
      setDisplayCount(prev => prev + 20);
    }, 500);
  };

  return (
    <>
      <Header 
        onAddClick={() => setIsModalOpen(true)}
        onOrganizersClick={() => setIsOrganizersOpen(true)}
        onSearch={setSearchTerm}
      />
      <FeedbackWall 
        items={visibleItems} 
        newestId={newestId} 
        loadMore={loadMore}
        hasMore={hasMore}
        isSearching={!!searchTerm}
      />
      <OrganizersSection />
      {/* ThemeToggle moved to Header */}

      <OrganizersModal 
        isOpen={isOrganizersOpen}
        onClose={() => setIsOrganizersOpen(false)}
      />

      {isModalOpen && (
        <FeedbackModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleNewFeedback}
        />
      )}
    </>
  );
}
