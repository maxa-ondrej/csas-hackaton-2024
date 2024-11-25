import { QueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import * as Layout from './components/layout';
import { client } from './lib/client';
import { routeTree } from './routeTree.gen';
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  Action,
} from "kbar";

interface Automation {
  id: string;
  state: string;
  type: string;
  last_activity: string;
  sas: string;
  error?: string;
}

interface Job {
  id: string;
  state: string;
  organization: string;
  SAS: string;
  runner: string;
  timestamp: string;
}

let kbarActions: Action[] = [
  {
    id: "home",
    name: "Home",
    shortcut: ["h"],
    keywords: "home main",
    perform: () => window.location.pathname = "/csas-hackaton-2024/",
    section: 'Navigation',
  },
];

const initializeActions = async () => {
  try {
    // Fetch automations
    const automationsResponse = await fetch('https://hackaton-api.fly.dev/api/v1/automations?page=1&limit=100&order=asc', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZG9wbzpEZXZPcHMyMDI0'
      }
    });
    const automations: Automation[] = await automationsResponse.json();

    // Fetch jobs
    const jobsResponse = await fetch('https://hackaton-api.fly.dev/api/v1/jobs?page=1&limit=100&order=asc', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZG9wbzpEZXZPcHMyMDI0'
      }
    });
    const jobs: Job[] = await jobsResponse.json();

    // Create automation actions
    const uniqueTypes = [...new Set(automations.map(automation => automation.type))];
    const automationActions = uniqueTypes.map(type => ({
      id: `automation-${type}`,
      name: `View ${type}`,
      shortcut: [],
      keywords: `automation ${type.toLowerCase()} view`,
      perform: () => {
        window.location.href = `/csas-hackaton-2024/automations/${type}`;
      },
      section: 'Automations',
    }));

    // Create SAS actions
    const uniqueSAS = [...new Set(jobs.map(job => job.SAS))];
    const sasActions = uniqueSAS.map(sas => ({
      id: `sas-${sas}`,
      name: `SAS: ${sas}`,
      shortcut: [],
      keywords: `sas ${sas.toLowerCase()} view`,
      perform: () => {
        // Check if we're already on the SAS page
        const isOnSasPage = window.location.pathname.endsWith('/sas');
        const urlParams = new URLSearchParams(window.location.search);
        const currentKey = urlParams.get('key');
    
        if (isOnSasPage) {
          // Update URL without page refresh
          const newUrl = `/csas-hackaton-2024/sas?key=${sas}`;
          window.history.pushState({}, '', newUrl);
          // Trigger a custom event to notify the SAS page component
          window.dispatchEvent(new CustomEvent('sasKeyChange', { detail: { key: sas } }));
        } else {
          // Regular navigation if not on SAS page
          window.location.href = `/csas-hackaton-2024/sas?key=${sas}`;
        }
      },
      section: 'SAS',
    }));

    kbarActions = [...kbarActions, ...automationActions, ...sasActions];
  } catch (error) {
    console.error('Failed to initialize actions:', error);
  }
};

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-sm text-gray-500">{item}</div>
        ) : (
          <div
            className={`px-4 py-2 flex items-center gap-2 cursor-pointer ${
              active ? "bg-gray-100" : "bg-white"
            }`}
          >
            <span className="text-gray-800">{item.name}</span>
            {item.shortcut?.length > 0 && (
              <span className="flex gap-1">
                {item.shortcut.map((shortcut: string) => (
                  <kbd key={shortcut} className="px-2 py-1 text-xs bg-gray-200 rounded">
                    {shortcut}
                  </kbd>
                ))}
              </span>
            )}
          </div>
        )
      }
    />
  );
}

function KBarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <KBarProvider actions={kbarActions}>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh]">
          <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <KBarSearch className="w-full border-none bg-transparent px-4 py-3 outline-none" />
            <div className="px-2 pb-4">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

const router = createRouter({
  ...Layout.routerConfig,
  routeTree,
  defaultPreload: 'intent',
  basepath: '/csas-hackaton-2024/',
  context: {
    client: new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
        },
      },
    }),
  },
});

export type Context = {
  client: QueryClient;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

client.setConfig({
  baseUrl: 'https://hackaton-api.fly.dev/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ZG9wbzpEZXZPcHMyMDI0',
  },
});

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  (async () => {
    await initializeActions();
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <KBarWrapper>
          <RouterProvider router={router} />
        </KBarWrapper>
      </StrictMode>,
    );
  })();
}
