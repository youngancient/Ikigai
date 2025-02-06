import { CaipNetwork, createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { liskSepolia as rawLiskSepolia } from "@reown/appkit/networks";

export const liskSepoliaNetwork: CaipNetwork = {
  ...rawLiskSepolia,
  id: 4202,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:4202",
};

// 1. Get projectId
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

// 2. Set the networks
const networks: [CaipNetwork, ...CaipNetwork[]] = [liskSepoliaNetwork];

// 3. Create a metadata object - optional
const metadata = {
  name: "LegacyX",
  description: "LegacyX Service",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  allowUnsupportedChain: false,
  allWallets: "SHOW",
  defaultNetwork: liskSepoliaNetwork,
  enableEIP6963: true,
  features: {
    analytics: true,
    allWallets: true,
    email: false,
    socials: [],
  },
});
