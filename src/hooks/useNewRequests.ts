import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface NewRequest {
  id: string;
  room: string;
  service: string;
  notes?: string | null;
  createdAt: string;
}

// פונקציה לנגן צליל התראה
function playNotificationSound() {
  try {
    // יצירת צליל פשוט באמצעות Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // תדירות גבוהה ונעימה
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
}

export function useNewRequests(hotelId?: string, enabled: boolean = true) {
  const [lastChecked, setLastChecked] = useState<string>(
    new Date().toISOString()
  );
  const isPollingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const processedIdsRef = useRef<Set<string>>(new Set());
  const lastCheckedRef = useRef<string>(lastChecked);

  // עדכון ה-ref כשהמצב משתנה
  useEffect(() => {
    lastCheckedRef.current = lastChecked;
  }, [lastChecked]);

  useEffect(() => {
    if (!enabled || !hotelId) return;

    const checkNewRequests = async () => {
      if (isPollingRef.current) return; // מונע קריאות מקבילות
      isPollingRef.current = true;

      try {
        const response = await fetch(
          `/api/requests/new?hotelId=${hotelId}&lastChecked=${encodeURIComponent(lastCheckedRef.current)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch new requests");
        }

        const data = await response.json();
        const newRequests: NewRequest[] = data.requests || [];

        // נבדוק רק הזמנות שלא כבר הצגנו
        const unseenRequests = newRequests.filter(
          (req) => !processedIdsRef.current.has(req.id)
        );

        if (unseenRequests.length > 0) {
          // נגן צליל
          playNotificationSound();

          // נציג התראה לכל הזמנה חדשה
          unseenRequests.forEach((request) => {
            processedIdsRef.current.add(request.id);

            toast.success("New Request!", {
              description: `Room ${request.room} - ${request.service}`,
              duration: 5000,
              action: {
                label: "View",
                onClick: () => {
                  window.location.href = "/dashboard/requests";
                },
              },
            });
          });

          // נעדכן את זמן הבדיקה האחרון
          const newLastChecked = new Date().toISOString();
          setLastChecked(newLastChecked);
          lastCheckedRef.current = newLastChecked;
        }
      } catch (error) {
        console.error("Error checking for new requests:", error);
      } finally {
        isPollingRef.current = false;
      }
    };

    // בדיקה ראשונית
    checkNewRequests();

    // בדיקה כל 5 שניות
    intervalRef.current = setInterval(checkNewRequests, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hotelId, enabled]);

  const isPolling = isPollingRef.current;

  return { isPolling };
}

