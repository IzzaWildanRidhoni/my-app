import { Link, usePage } from '@inertiajs/react';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Users, Shield, LogOut, ChevronUp, Settings,ClipboardList  } from 'lucide-react';

function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user?.roles?.includes('admin');

    const menuItems = [
        {
            title: 'Main',
            items: [
                { title: 'Dashboard', url: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
            ],
        },
    ];

    if (isAdmin) {
        menuItems.push({
            title: 'Administration',
            items: [
                {
                    title: 'Peserta',
                    url: route('admin.peserta.index'),
                    icon: ClipboardList,
                    active: route().current('admin.peserta.*'),
                },
                { title: 'User Management', url: route('admin.users.index'), icon: Users, active: route().current('admin.users.*') },
                { title: 'Roles & Permissions', url: route('admin.roles.index'), icon: Shield, active: route().current('admin.roles.*') },
            ],
        });
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Settings className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-lg">Lpq Admin</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.active}>
                                            <Link href={item.url}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start text-sm">
                                        <span className="font-medium">{user?.name}</span>
                                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                                    </div>
                                    <ChevronUp className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Profile Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post" as="button" className="w-full">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default function AuthenticatedLayout({ children, header }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
                        <SidebarTrigger />
                        {header && (
                            <>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="font-semibold">{header}</div>
                            </>
                        )}
                    </header>
                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}