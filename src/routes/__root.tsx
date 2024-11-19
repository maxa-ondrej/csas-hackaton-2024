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
import { getAutomationTypes } from '@/lib/client';
import {
  Link,
  Outlet,
  createRootRoute,
  useMatch,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { version } from '../../package.json';
import '../index.css';

export const Route = createRootRoute({
  component: RootComponent,
  loader: async ({ abortController }) => {
    const automationTypes = await getAutomationTypes({
      signal: abortController.signal,
      throwOnError: true,
    });

    return { automationTypes: automationTypes.data };
  },
});

function RootComponent() {
  const { automationTypes } = Route.useLoaderData();
  const route = useMatch({ from: '/automations/$type/', shouldThrow: false });
  return (
    <SidebarProvider>
      <Toaster />
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <Link to="/" activeProps={{ className: 'font-bold' }}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Home</SidebarMenuButton>
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
                <Link to="/sas" activeProps={{ className: 'font-bold' }}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>SAS</SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="container mx-auto py-8">
        <Outlet />
        <p>
          <small>Current version: v{version}</small>
        </p>
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </SidebarProvider>
  );
}
