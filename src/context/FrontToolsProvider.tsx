"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AgentActionOverlay } from "@/components/globals/AgentActionOverlay";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";

type ActionRegistry = {
  [key: string]: (payload: any) => void;
};

interface FrontToolsContextType {
  isConnected: boolean;
  automationEnabled: boolean;
  setAutomationEnabled: (val: boolean) => void;
}

const FrontToolsContext = createContext<FrontToolsContextType>({
  isConnected: false,
  automationEnabled: false,
  setAutomationEnabled: () => {},
});

export const useFrontTools = () => useContext(FrontToolsContext);

export function FrontToolsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isConnected, setIsConnected] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true); // Default to true
  const wsRef = useRef<WebSocket | null>(null);

  // Overlay state
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [actionText, setActionText] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const { setTheme } = useTheme();
  const setThemeRef = useRef(setTheme);
  useEffect(() => { setThemeRef.current = setTheme; }, [setTheme]);

  // Tool Registry
  const tools = useRef<ActionRegistry>({
    'navigate': (payload) => {
      if (payload.url) {
        router.push(payload.url);
      }
    },
    'get-inputs': (payload) => {
      console.log('Focusing input element', payload.inputId || payload.formId);
      const id = payload.inputId || payload.formId;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    },
    'click-button': (payload) => {
      console.log('Clicking button', payload.buttonId);
      const btn = document.getElementById(payload.buttonId);
      if (btn) btn.click();
    },
    'change-theme': (payload) => {
      console.log('Changing theme to', payload.theme);
      if (payload.theme && setThemeRef.current) {
        setThemeRef.current(payload.theme);
      }
    },
    'scroll-to': (payload) => {
      console.log('Scrolling to', payload.elementId);
      if (payload.elementId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (payload.elementId === 'bottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(payload.elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    'highlight-element': (payload) => {
      console.log('Highlighting element', payload.elementId);
      const el = document.getElementById(payload.elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const originalBoxShadow = el.style.boxShadow;
        const originalTransition = el.style.transition;
        
        el.style.transition = 'box-shadow 0.3s ease-in-out';
        el.style.boxShadow = '0 0 0 4px hsl(var(--primary)), 0 0 20px hsl(var(--primary))';
        
        setTimeout(() => {
          el.style.boxShadow = originalBoxShadow;
          setTimeout(() => {
            el.style.transition = originalTransition;
          }, 300);
        }, 5000);
      }
    },
    'fire-confetti': () => {
      console.log('Firing confetti!');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
        zIndex: 99999
      });
    },
    'trigger-fireworks': () => {
      console.log('Triggering fireworks!');
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    },
    'trigger-snow': () => {
      console.log('Triggering snow!');
      const duration = 10 * 1000;
      const animationEnd = Date.now() + duration;
      let skew = 1;

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      (function frame() {
        const timeLeft = animationEnd - Date.now();
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: ticks,
          origin: {
            x: Math.random(),
            y: (Math.random() * skew) - 0.2
          },
          colors: ['#ffffff'],
          shapes: ['circle'],
          gravity: randomInRange(0.4, 0.6),
          scalar: randomInRange(0.4, 1),
          drift: randomInRange(-0.4, 0.4),
          zIndex: 99999
        });

        if (timeLeft > 0) {
          requestAnimationFrame(frame);
        }
      }());
    },
    'read-aloud': (payload) => {
      console.log('Reading aloud:', payload.text);
      if ('speechSynthesis' in window && payload.text) {
        const utterance = new SpeechSynthesisUtterance(payload.text);
        window.speechSynthesis.speak(utterance);
      }
    },
    'vibrate-device': () => {
      console.log('Vibrating device!');
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    },
    'create-chaos': () => {
      console.log('Creating chaos!');
      const elements = Array.from(document.body.querySelectorAll('*')) as HTMLElement[];
      const originalStyles = new Map<HTMLElement, string>();

      elements.forEach(el => {
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT' || el.tagName === 'LINK' || el.tagName === 'META' || el.tagName === 'HEAD') return;
        
        // Save original style
        originalStyles.set(el, el.getAttribute('style') || '');
        
        // Apply chaos
        const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
        const randomDuration = 0.5 + Math.random() * 2;
        const randomDelay = Math.random() * 0.5;

        el.style.transition = `transform ${randomDuration}s ease-in ${randomDelay}s, opacity ${randomDuration}s ease-in ${randomDelay}s`;
        el.style.transform = `translate(${randomX}px, ${window.innerHeight + 500}px) rotate(${Math.random() * 1080 - 540}deg)`;
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      });

      // Restore after 5 seconds
      setTimeout(() => {
        elements.forEach(el => {
          if (originalStyles.has(el)) {
            el.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            el.style.transform = 'translate(0, 0) rotate(0deg)';
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            
            // Clean up inline styles after restore
            setTimeout(() => {
              const orig = originalStyles.get(el);
              if (orig === '') el.removeAttribute('style');
              else el.setAttribute('style', orig!);
            }, 1000);
          }
        });
      }, 5000);
    }
  });

  const cancelAction = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setOverlayOpen(false);
  }, [timeoutId]);

  const executeWithOverlay = useCallback((text: string, actionFn: () => void) => {
    setActionText(text);
    setOverlayOpen(true);
    
    // Auto execute after 3 seconds if not cancelled
    const id = setTimeout(() => {
      actionFn();
      setOverlayOpen(false);
    }, 3000);
    
    setTimeoutId(id);
  }, []);

  useEffect(() => {
    if (!user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const connectWebSocket = async () => {
      try {
        const token = await user.getIdToken();
        const socketUrl = process.env.NEXT_PUBLIC_AGENT_API_URL?.replace('http', 'ws') || 'ws://localhost:4000';
        
        const socket = new WebSocket(socketUrl);
        wsRef.current = socket;
        
        socket.onopen = () => {
          setIsConnected(true);
          socket.send(JSON.stringify({ type: 'auth', token }));
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'frontend_action' && automationEnabled) {
              const { action, payload } = data;
              if (tools.current[action]) {
                executeWithOverlay(`Executing ${action}...`, () => tools.current[action](payload));
              }
            }
          } catch (e) {
            console.error('WebSocket message parse error:', e);
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
        };
      } catch (err) {
        console.error('Failed to init websocket', err);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, automationEnabled, executeWithOverlay]);

  return (
    <FrontToolsContext.Provider value={{ isConnected, automationEnabled, setAutomationEnabled }}>
      {children}
      <AgentActionOverlay 
        isOpen={overlayOpen} 
        actionText={actionText} 
        onCancel={cancelAction} 
      />
    </FrontToolsContext.Provider>
  );
}
