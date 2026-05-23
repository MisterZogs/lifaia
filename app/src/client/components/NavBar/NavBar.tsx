import { LogIn, Menu } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../client/components/ui/sheet";
import { throttleWithTrailingInvocation } from "../../../shared/utils";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";
import { useIsLandingPage } from "../../hooks/useIsLandingPage";
import logo from "../../static/logo.webp";
import { cn } from "../../utils";
import DarkModeSwitcher from "../DarkModeSwitcher";
import { Announcement } from "./Announcement";
import i18n from "../../i18n";

export interface NavigationItem {
  name: string;
  to: string;
  ns?: string;
}

const LANGS = [
  { code: 'fr', label: '🇫🇷 FR' },
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'es', label: '🇪🇸 ES' },
]

export default function NavBar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLandingPage = useIsLandingPage();

  useEffect(() => {
    const throttledHandler = throttleWithTrailingInvocation(() => {
      setIsScrolled(window.scrollY > 0);
    }, 50);

    window.addEventListener("scroll", throttledHandler);

    return () => {
      window.removeEventListener("scroll", throttledHandler);
      throttledHandler.cancel();
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled && "top-4",
        )}
      >
        <div
          className={cn("transition-all duration-300", {
            "bg-background/90 border-border mx-4 rounded-full border pr-2 shadow-lg backdrop-blur-lg md:mx-20 lg:pr-0":
              isScrolled,
            "bg-background/80 border-border mx-0 border-b backdrop-blur-lg":
              !isScrolled,
          })}
        >
          <nav
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              {
                "p-3 lg:px-6": isScrolled,
                "p-6 lg:px-8": !isScrolled,
              },
            )}
            aria-label="Global"
          >
            <div className="flex items-center gap-6">
              <WaspRouterLink
                to={routes.LandingPageRoute.to}
                className="text-foreground hover:text-primary flex items-center transition-colors duration-300 ease-in-out"
              >
                <NavLogo isScrolled={isScrolled} />
                <span
                  className={cn(
                    "text-foreground leading-6 font-semibold transition-all duration-300",
                    {
                      "ml-2 text-sm": !isScrolled,
                      "ml-2 text-xs": isScrolled,
                    },
                  )}
                >
                  Lifaia
                </span>
              </WaspRouterLink>

              <ul className="ml-4 hidden items-center gap-6 lg:flex">
                {renderNavigationItems(navigationItems)}
              </ul>
            </div>
            <NavBarMobileMenu
              isScrolled={isScrolled}
              navigationItems={navigationItems}
            />
            <NavBarDesktopUserDropdown isScrolled={isScrolled} />
          </nav>
        </div>
      </header>
    </>
  );
}

function NavBarDesktopUserDropdown({ isScrolled }: { isScrolled: boolean }) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const { t } = useTranslation('auth');
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Mise à jour du bouton actif quand la langue change
  useEffect(() => {
    const handleLangChange = (lng: string) => setCurrentLang(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => { i18n.off('languageChanged', handleLangChange); };
  }, []);

  return (
    <div className="hidden items-center justify-end gap-3 lg:flex lg:flex-1">
      <ul className="flex items-center justify-center gap-2 sm:gap-4">
        {/* Sélecteur de langue */}
        <select
          value={LANGS.find((l) => currentLang === l.code || currentLang?.startsWith(l.code))?.code ?? 'fr'}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="text-xs font-medium rounded border border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-300 px-1.5 py-0.5 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code} className="bg-white dark:bg-gray-800">
              {l.label}
            </option>
          ))}
        </select>
        <DarkModeSwitcher />
      </ul>
      {isUserLoading ? null : !user ? (
        <WaspRouterLink
          to={routes.LoginRoute.to}
          className={cn(
            "ml-3 leading-6 font-semibold transition-all duration-300",
            {
              "text-sm": !isScrolled,
              "text-xs": isScrolled,
            },
          )}
        >
          <div className="text-foreground hover:text-primary flex items-center transition-colors duration-300 ease-in-out">
            {t('login')}{" "}
            <LogIn
              size={isScrolled ? "1rem" : "1.1rem"}
              className={cn("transition-all duration-300", {
                "mt-[0.1rem] ml-1": !isScrolled,
                "ml-1": isScrolled,
              })}
            />
          </div>
        </WaspRouterLink>
      ) : (
        <div className="ml-3">
          <UserDropdown user={user} />
        </div>
      )}
    </div>
  );
}

function NavBarMobileMenu({
  isScrolled,
  navigationItems,
}: {
  isScrolled: boolean;
  navigationItems: NavigationItem[];
}) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const { t } = useTranslation('auth');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const handleLangChange = (lng: string) => setCurrentLang(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => { i18n.off('languageChanged', handleLangChange); };
  }, []);

  return (
    <div className="flex lg:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              "text-muted-foreground hover:text-muted hover:bg-accent inline-flex items-center justify-center rounded-md transition-colors",
            )}
          >
            <span className="sr-only">Open main menu</span>
            <Menu
              className={cn("transition-all duration-300", {
                "size-8 p-1": !isScrolled,
                "size-6 p-0.5": isScrolled,
              })}
              aria-hidden="true"
            />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <WaspRouterLink to={routes.LandingPageRoute.to}>
                <span className="sr-only">Lifaia</span>
                <NavLogo isScrolled={false} />
              </WaspRouterLink>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flow-root">
            <div className="divide-border -my-6 divide-y">
              <ul className="space-y-2 py-6">
                {renderNavigationItems(navigationItems, setMobileMenuOpen)}
              </ul>
              <div className="py-6">
                {isUserLoading ? null : !user ? (
                  <WaspRouterLink to={routes.LoginRoute.to}>
                    <div className="text-foreground hover:text-primary flex items-center justify-end transition-colors duration-300 ease-in-out">
                      {t('login')} <LogIn size="1.1rem" className="ml-1" />
                    </div>
                  </WaspRouterLink>
                ) : (
                  <ul className="space-y-2">
                    <UserMenuItems
                      user={user}
                      onItemClick={() => setMobileMenuOpen(false)}
                    />
                  </ul>
                )}
              </div>
              <div className="py-6 flex items-center gap-4">
                <DarkModeSwitcher />
                <select
                  value={LANGS.find((l) => currentLang === l.code || currentLang?.startsWith(l.code))?.code ?? 'fr'}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="text-sm font-medium rounded border border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-300 px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {LANGS.map((l) => (
                    <option key={l.code} value={l.code} className="bg-white dark:bg-gray-800">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function renderNavigationItems(
  navigationItems: NavigationItem[],
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>,
) {
  const menuStyles = cn({
    "block rounded-lg px-3 py-2 text-sm font-medium leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors":
      !!setMobileMenuOpen,
    "text-sm font-normal leading-6 text-foreground duration-300 ease-in-out hover:text-primary transition-colors":
      !setMobileMenuOpen,
  });

  return navigationItems.map((item) => (
    <NavItem
      key={item.name}
      item={item}
      menuStyles={menuStyles}
      setMobileMenuOpen={setMobileMenuOpen}
    />
  ));
}

// Composant séparé pour pouvoir utiliser useTranslation dans renderNavigationItems
function NavItem({
  item,
  menuStyles,
  setMobileMenuOpen,
}: {
  item: NavigationItem;
  menuStyles: string;
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const label = t(item.name, { ns: item.ns ?? 'common' });

  return (
    <li key={item.name}>
      <ReactRouterLink
        to={item.to}
        className={menuStyles}
        onClick={setMobileMenuOpen && (() => setMobileMenuOpen(false))}
        target={item.to.startsWith("http") ? "_blank" : undefined}
      >
        {label}
      </ReactRouterLink>
    </li>
  );
}

const NavLogo = ({ isScrolled }: { isScrolled: boolean }) => (
  <img
    className={cn("transition-all duration-500", {
      "size-8": !isScrolled,
      "size-7": isScrolled,
    })}
    src={logo}
    alt="Lifaia App"
  />
);
