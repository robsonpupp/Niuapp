
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  Calendar,
  FileBarChart,
  Users,
  FileText,
  LogOut,
  Menu,
  User as UserIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690a3bc1eec0630eef5a4fec/c4a857df9_Logosemfundo.png";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Movimentações",
    url: createPageUrl("Transactions"),
    icon: ArrowLeftRight,
  },
  {
    title: "Metas",
    url: createPageUrl("Goals"),
    icon: Target,
  },
  {
    title: "Planejamento",
    url: createPageUrl("Planning"),
    icon: Calendar,
  },
  {
    title: "DRE",
    url: createPageUrl("Reports"),
    icon: FileBarChart,
  },
  {
    title: "Análises",
    url: createPageUrl("Analytics"),
    icon: FileBarChart,
  },
  {
    title: "Contatos",
    url: createPageUrl("Contacts"),
    icon: Users,
  },
  {
    title: "Área MEI",
    url: createPageUrl("MEI"),
    icon: FileText,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <Sidebar className="border-r border-emerald-100/50 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-emerald-100/50 p-6">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_URL} 
                alt="Niu Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Niu
                </h2>
                <p className="text-xs text-gray-500">Seu crescimento financeiro</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Menu Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            hover:bg-emerald-50 hover:text-emerald-700 
                            transition-all duration-200 rounded-lg mb-1
                            ${isActive ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-md hover:from-emerald-600 hover:to-blue-700 hover:text-white' : ''}
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-emerald-100/50 p-4">
            {user && (
              <div className="space-y-3">
                <Link to={createPageUrl("Profile")}>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg hover:shadow-md transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user.full_name || "Usuário"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-gray-600 hover:text-red-600 hover:border-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100/50 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <div className="flex items-center gap-2 lg:hidden">
                  <img 
                    src={LOGO_URL} 
                    alt="Niu Logo" 
                    className="w-8 h-8 object-contain"
                  />
                  <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Niu
                  </h1>
                </div>
              </div>

              {/* Dropdown de Perfil no Header */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-50">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name || "Usuário"}</p>
                        <p className="text-xs leading-none text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Profile")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
