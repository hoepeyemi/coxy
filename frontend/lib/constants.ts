import { DocsConfig } from "./types";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
const TEST_BONK_TOKEN_MINT_ADDRESS =
  "J5xh6VWTmNmgVmhgGqEd6fgzZunt2hPqLmiXB85C5Wna";

const pumpfunSample = {
  extraction_time: "2024-12-11 16:35:15",
  total_searches: 1,
  results: {
    pumpfun: {
      total_tokens: 6,
      tokens: [
        {
          posted_time: "4h ago",
          posted_timestamp: 1733891681.760984,
          token_url: "https://pump.fun/DMC",
          description: "Doge Meet Cat aka DMC ticker currently on pump fun. Discord link in bio come join a great hard workin community.",
          hashtags: [],
          author: "pumpfun_bot",
          volume: "1.2M",
          extracted_time: "2024-12-11 16:34:41",
          comments: {
            count: 5,
            tickers: {
              DMC: 2,
            },
            data: [
              "everyone still sleepin on kitcat, wild",
              "Hell yea",
              "$DMC TO THE 🚀 🌕",
              "$kitcat 🚀🔥🔥🔥🌕🔥",
              "solana memes have leveled up. kitcat added ai tech",
            ],
          },
        },
        {
          posted_time: "4h ago",
          posted_timestamp: 1733891682.31884,
          token_url: "https://pump.fun/DMC",
          description: "Discord link in bio Doge Meet Cat aka DMC currently on pump fun get in early and become part of a hard working community. #mem",
          hashtags: [],
          author: "pumpfun_bot",
          volume: "890K",
          extracted_time: "2024-12-11 16:34:42",
          comments: {
            count: 3,
            tickers: {
              DMC: 2,
            },
            data: ["🤣🤣", "$Dmc", "$DMC"],
          },
        },
        {
          posted_time: "4h ago",
          posted_timestamp: 1733891682.834023,
          token_url: "https://pump.fun/TRENCHES",
          description: "live now on pump.fun $TRENCHES 📈",
          hashtags: ["#crypto", "#bitcoin"],
          author: "pumpfun_bot",
          volume: "2.1M",
          extracted_time: "2024-12-11 16:34:42",
          comments: {
            count: 6,
            tickers: {
              NOW: 1,
            },
            data: [
              "bro buy kitcat NOW 💰",
              "These dips don't scare me, buying kitcat",
              "Shall I buy $kitcat?",
              "Already up 3x on $kitcat, and I'm still holding",
              "$kitcat is IT rn 🔥🔥🔥🔥",
              "Check out $OpiumPepe. Got a great community behind it and recently got the whales out of the coin it's ready to launch. 🚀 🐸🚀",
            ],
          },
        },
      ],
    },
  },
};
const ITEMS_PER_PAGE = 20;

const IPFS_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";
const IPFS_GATEWAY_URL_2 = "https://ipfs.io/ipfs/";
const IPFS_GATEWAY_URL_3 = "https://dweb.link/ipfs/";
const IPFS_GATEWAY_URL_4 = "https://nftstorage.link/ipfs/";


const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Components",
      href: "/docs/components/accordion",
    },
    {
      title: "Blocks",
      href: "/blocks",
    },
    {
      title: "Charts",
      href: "/charts",
    },
    {
      title: "Themes",
      href: "/themes",
    },
    {
      title: "Colors",
      href: "/colors",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "components.json",
          href: "/docs/components-json",
          items: [],
        },
        {
          title: "Theming",
          href: "/docs/theming",
          items: [],
        },
        {
          title: "Dark mode",
          href: "/docs/dark-mode",
          items: [],
        },
        {
          title: "CLI",
          href: "/docs/cli",
          items: [],
        },
        {
          title: "Next.js 15 + React 19",
          href: "/docs/react-19",
          items: [],
        },
        {
          title: "Typography",
          href: "/docs/components/typography",
          items: [],
        },
        {
          title: "Open in v0",
          href: "/docs/v0",
          items: [],
        },
        {
          title: "Figma",
          href: "/docs/figma",
          items: [],
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
    {
      title: "Installation",
      items: [
        {
          title: "Next.js",
          href: "/docs/installation/next",
          items: [],
        },
        {
          title: "Vite",
          href: "/docs/installation/vite",
          items: [],
        },
        {
          title: "Remix",
          href: "/docs/installation/remix",
          items: [],
        },
        {
          title: "Astro",
          href: "/docs/installation/astro",
          items: [],
        },
        {
          title: "Laravel",
          href: "/docs/installation/laravel",
          items: [],
        },
        {
          title: "Gatsby",
          href: "/docs/installation/gatsby",
          items: [],
        },
        {
          title: "Manual",
          href: "/docs/installation/manual",
          items: [],
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Sidebar",
          href: "/docs/components/sidebar",
          items: [],
          label: "New",
        },
        {
          title: "Accordion",
          href: "/docs/components/accordion",
          items: [],
        },
        {
          title: "Alert",
          href: "/docs/components/alert",
          items: [],
        },
        {
          title: "Alert Dialog",
          href: "/docs/components/alert-dialog",
          items: [],
        },
        {
          title: "Aspect Ratio",
          href: "/docs/components/aspect-ratio",
          items: [],
        },
        {
          title: "Avatar",
          href: "/docs/components/avatar",
          items: [],
        },
        {
          title: "Badge",
          href: "/docs/components/badge",
          items: [],
        },
        {
          title: "Breadcrumb",
          href: "/docs/components/breadcrumb",
          items: [],
        },
        {
          title: "Button",
          href: "/docs/components/button",
          items: [],
        },
        {
          title: "Calendar",
          href: "/docs/components/calendar",
          items: [],
        },
        {
          title: "Card",
          href: "/docs/components/card",
          items: [],
        },
        {
          title: "Carousel",
          href: "/docs/components/carousel",
          items: [],
        },
        {
          title: "Chart",
          href: "/docs/components/chart",
          items: [],
        },
        {
          title: "Checkbox",
          href: "/docs/components/checkbox",
          items: [],
        },
        {
          title: "Collapsible",
          href: "/docs/components/collapsible",
          items: [],
        },
        {
          title: "Combobox",
          href: "/docs/components/combobox",
          items: [],
        },
        {
          title: "Command",
          href: "/docs/components/command",
          items: [],
        },
        {
          title: "Context Menu",
          href: "/docs/components/context-menu",
          items: [],
        },
        {
          title: "Data Table",
          href: "/docs/components/data-table",
          items: [],
        },
        {
          title: "Date Picker",
          href: "/docs/components/date-picker",
          items: [],
        },
        {
          title: "Dialog",
          href: "/docs/components/dialog",
          items: [],
        },
        {
          title: "Drawer",
          href: "/docs/components/drawer",
          items: [],
        },
        {
          title: "Dropdown Menu",
          href: "/docs/components/dropdown-menu",
          items: [],
        },
        {
          title: "Form",
          href: "/docs/components/form",
          items: [],
        },
        {
          title: "Hover Card",
          href: "/docs/components/hover-card",
          items: [],
        },
        {
          title: "Input",
          href: "/docs/components/input",
          items: [],
        },
        {
          title: "Input OTP",
          href: "/docs/components/input-otp",
          items: [],
        },
        {
          title: "Label",
          href: "/docs/components/label",
          items: [],
        },
        {
          title: "Menubar",
          href: "/docs/components/menubar",
          items: [],
        },
        {
          title: "Navigation Menu",
          href: "/docs/components/navigation-menu",
          items: [],
        },
        {
          title: "Pagination",
          href: "/docs/components/pagination",
          items: [],
        },
        {
          title: "Popover",
          href: "/docs/components/popover",
          items: [],
        },
        {
          title: "Progress",
          href: "/docs/components/progress",
          items: [],
        },
        {
          title: "Radio Group",
          href: "/docs/components/radio-group",
          items: [],
        },
        {
          title: "Resizable",
          href: "/docs/components/resizable",
          items: [],
        },
        {
          title: "Scroll Area",
          href: "/docs/components/scroll-area",
          items: [],
        },
        {
          title: "Select",
          href: "/docs/components/select",
          items: [],
        },
        {
          title: "Separator",
          href: "/docs/components/separator",
          items: [],
        },
        {
          title: "Sheet",
          href: "/docs/components/sheet",
          items: [],
        },
        {
          title: "Skeleton",
          href: "/docs/components/skeleton",
          items: [],
        },
        {
          title: "Slider",
          href: "/docs/components/slider",
          items: [],
        },
        {
          title: "Sonner",
          href: "/docs/components/sonner",
          items: [],
        },
        {
          title: "Switch",
          href: "/docs/components/switch",
          items: [],
        },
        {
          title: "Table",
          href: "/docs/components/table",
          items: [],
        },
        {
          title: "Tabs",
          href: "/docs/components/tabs",
          items: [],
        },
        {
          title: "Textarea",
          href: "/docs/components/textarea",
          items: [],
        },
        {
          title: "Toast",
          href: "/docs/components/toast",
          items: [],
        },
        {
          title: "Toggle",
          href: "/docs/components/toggle",
          items: [],
        },
        {
          title: "Toggle Group",
          href: "/docs/components/toggle-group",
          items: [],
        },
        {
          title: "Tooltip",
          href: "/docs/components/tooltip",
          items: [],
        },
      ],
    },
  ],
  chartsNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/charts",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/charts/installation",
          items: [],
        },
        {
          title: "Theming",
          href: "/docs/charts/theming",
          items: [],
        },
      ],
    },
    {
      title: "Charts",
      items: [
        {
          title: "Area Chart",
          href: "/docs/charts/area",
          items: [],
        },
        {
          title: "Bar Chart",
          href: "/docs/charts/bar",
          items: [],
        },
        {
          title: "Line Chart",
          href: "/docs/charts/line",
          items: [],
        },
        {
          title: "Pie Chart",
          href: "/docs/charts/pie",
          items: [],
        },
        {
          title: "Radar Chart",
          href: "/docs/charts/radar",
          items: [],
        },
        {
          title: "Radial Chart",
          href: "/docs/charts/radial",
          items: [],
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Tooltip",
          href: "/docs/charts/tooltip",
          items: [],
        },
        {
          title: "Legend",
          href: "/docs/charts/legend",
          items: [],
        },
      ],
    },
  ],
};
const ZOROX_TREASURY_ADDRESS = "DUAqcapjRqWzkrC3TmA5Me9LnW4RxUdiuHiaqpL4XJEt";
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
export {
  pumpfunSample,
  ITEMS_PER_PAGE,
  docsConfig,
  TEST_BONK_TOKEN_MINT_ADDRESS,
  ZOROX_TREASURY_ADDRESS,
  IPFS_GATEWAY_URL,
  IPFS_GATEWAY_URL_2,
  IPFS_GATEWAY_URL_3,
  IPFS_GATEWAY_URL_4,
  wallets,
};