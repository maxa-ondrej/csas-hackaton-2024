import {
  ArrowTopRightOnSquareIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  HomeIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';
import { QueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import {
  type Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from 'kbar';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import * as Layout from './components/layout';
import { client } from './lib/client';
import { routeTree } from './routeTree.gen';

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

let kbarActions: Action[] = [
  {
    id: 'home',
    name: 'Home',
    shortcut: ['h'],
    keywords: 'home main index',
    perform: () =>
      router.navigate({
        to: '/',
      }),
    section: 'Navigation',
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    id: 'sas',
    name: 'SAS',
    shortcut: ['s'],
    keywords: 'sas',
    perform: () =>
      router.navigate({
        to: '/sas',
      }),
    section: 'Navigation',
    icon: <ServerIcon className="w-5 h-5" />,
  },
  {
    id: 'runners',
    name: 'Runners',
    shortcut: ['r'],
    keywords: 'runners',
    perform: () =>
      router.navigate({
        to: '/runners',
      }),
    section: 'Navigation',
    icon: <ComputerDesktopIcon className="w-5 h-5" />,
  },
  {
    id: 'state-all',
    name: 'View All Jobs',
    shortcut: ["j", "j"],
    keywords: 'all jobs total everything',
    perform: () => {
        const isOnSasPage = window.location.pathname.includes('/sas/jobs');
        if (isOnSasPage) {
            router.navigate({
                to: '/sas/jobs',
                search: {
                    state: 'all',
                },
            });
            window.dispatchEvent(
                new CustomEvent('stateChange', { detail: { state: 'all' } })
            );
        } else {
            router.navigate({
                to: '/sas/jobs',
                search: {
                    state: 'all',
                },
            });
        }
    },
},

  {
    id: 'state-success',
    name: 'View Success Jobs',
    shortcut: ['j', 's'],
    keywords: 'success successful completed',
    perform: () => {
      const isOnSasPage = window.location.pathname.includes('/sas/jobs');
      if (isOnSasPage) {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'success',
          },
        });
        window.dispatchEvent(
          new CustomEvent('stateChange', { detail: { state: 'success' } })
        );
      } else {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'success',
          },
        });
      }
    },
    section: 'Job States',
    icon: <ServerIcon className="w-5 h-5" />,
  },
  {
    id: 'state-failed',
    name: 'View Failed Jobs',
    shortcut: ["j", "f"],
    keywords: 'failed failure error',
    perform: () => {
      const isOnSasPage = window.location.pathname.includes('/sas/jobs');
      if (isOnSasPage) {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'failed',
          },
        });
        window.dispatchEvent(
          new CustomEvent('stateChange', { detail: { state: 'failed' } })
        );
      } else {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'failed',
          },
        });
      }
    },
    section: 'Job States',
    icon: <ServerIcon className="w-5 h-5" />,
  },
  {
    id: 'state-queued',
    name: 'View Queued Jobs',
    shortcut: ["j", "q"],
    keywords: 'queued queue waiting',
    perform: () => {
      const isOnSasPage = window.location.pathname.includes('/sas/jobs');
      if (isOnSasPage) {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'queued',
          },
        });
        window.dispatchEvent(
          new CustomEvent('stateChange', { detail: { state: 'queued' } })
        );
      } else {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'queued',
          },
        });
      }
    },
    section: 'Job States',
    icon: <ServerIcon className="w-5 h-5" />,
  },
  {
    id: 'state-in-progress',
    name: 'View In Progress Jobs',
    shortcut: ["j", "p"],
    keywords: 'in progress running ongoing active',
    perform: () => {
      const isOnSasPage = window.location.pathname.includes('/sas/jobs');
      if (isOnSasPage) {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'in_progress',
          },
        });
        window.dispatchEvent(
          new CustomEvent('stateChange', { detail: { state: 'in_progress' } })
        );
      } else {
        router.navigate({
          to: '/sas/jobs',
          search: {
            state: 'in_progress',
          },
        });
      }
    },
    section: 'Job States',
    icon: <ServerIcon className="w-5 h-5" />,
  },
];

const initializeActions = async () => {
  try {
    // Fetch automations
    const automationsResponse = await fetch(
      'https://hackaton-api.fly.dev/api/v1/automations?page=1&limit=100&order=asc',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ZG9wbzpEZXZPcHMyMDI0',
        },
      },
    );
    const automations: Automation[] = await automationsResponse.json();

    // Fetch jobs
    const jobsResponse = await fetch(
      'https://hackaton-api.fly.dev/api/v1/jobs?page=1&limit=100&order=asc',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ZG9wbzpEZXZPcHMyMDI0',
        },
      },
    );
    const jobs: Job[] = await jobsResponse.json();

    // Create automation actions
    const uniqueTypes = [
      ...new Set(automations.map((automation) => automation.type)),
    ];
    const automationActions = uniqueTypes.map((type) => ({
      id: `automation-${type}`,
      name: `View ${type}`,
      shortcut: [],
      keywords: `automation ${type.toLowerCase()} view`,
      perform: () => {
        window.location.href = `/csas-hackaton-2024/automations/${type}`;
      },
      section: 'Automations',
    }));

    const uniqueSAS = [...new Set(jobs.map((job) => job.SAS))];

    const sasActions = uniqueSAS.map((sas) => ({
      id: `sas-${sas}`,
      name: `View ${sas}`,
      shortcut: [],
      keywords: `sas ${sas.toLowerCase()} view`,
      perform: () => {
        const isOnSasPage = window.location.pathname.includes('/sas/jobs');
        if (isOnSasPage) {
          router.navigate({
            to: '/sas/jobs',
            search: {
              key: sas,
            },
          }).then(() => {
            setTimeout(() => {
              const element = document.querySelector(`[data-sas="${sas}"]`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          });
          window.dispatchEvent(
            new CustomEvent('sasKeyChange', { detail: { key: sas } })
          );
        } else {
          router.navigate({
            to: '/sas/jobs',
            search: {
              key: sas,
            },
          }).then(() => {
            setTimeout(() => {
              const element = document.querySelector(`[data-sas="${sas}"]`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          });
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
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-sm text-gray-500">{item}</div>
        ) : (
          <div
            className={`px-4 py-2 flex items-center gap-2 cursor-pointer ${
              active ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            {item.icon && (
              <span className="flex items-center">{item.icon}</span>
            )}
            <span className="text-gray-800">{item.name}</span>
            {(item.shortcut?.length ?? 0) > 0 && (
              <span className="flex gap-1">
                {item.shortcut?.map((shortcut: string) => (
                  <kbd
                    key={shortcut}
                    className="px-2 py-1 text-xs bg-gray-200 rounded"
                  >
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

// biome-ignore lint/style/noNonNullAssertion: <explanation>
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
