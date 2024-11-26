import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { getAutomationTypesOptions } from '@/lib/client/@tanstack/react-query.gen';
import { createLoader } from '@/lib/loader';
import type { Context } from '@/main';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useMatch,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { version } from '../../package.json';
import '../index.css';
import { Separator } from '@/components/ui/separator';
import { H3 } from '@/components/ui/typography';
import { Rocket } from 'lucide-react';

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
  loader: ({ context }) =>
    createLoader({
      automationTypes: context.client.fetchQuery(getAutomationTypesOptions()),
    }),
});

function RootComponent() {
  const { client } = Route.useRouteContext();
  const { automationTypes } = Route.useLoaderData();
  const route = useMatch({ from: '/automations/$type/', shouldThrow: false });
  return (
    <QueryClientProvider client={client}>
      <SidebarProvider>
        <Toaster />
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="p-3">
                  <H3 className="flex gap-4 items-center">
                    <Rocket />
                    Jarvis
                  </H3>
                  <Separator className="mt-4 mb-4" />
                  <Link to="/sas/jobs" activeProps={{ className: 'font-bold' }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton>SAS Jobs</SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                  <Link to="/runners" activeProps={{ className: 'font-bold' }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Runners</SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                  <Collapsible
                    defaultOpen={route !== undefined}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>Automations</SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {automationTypes.map((automationType) => (
                            <Link
                              key={automationType.type}
                              to={`/automations/${automationType.type}`}
                              activeProps={{ className: 'font-bold' }}
                              className="text-xs"
                            >
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>
                                  {automationType.type}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </Link>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                  <Link to="/chat" activeProps={{ className: 'font-bold' }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Assistant</SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <p className="text-right">
                <small className="font-mono">v{version}</small>
              </p>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
