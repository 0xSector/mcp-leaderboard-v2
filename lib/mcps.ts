import { MCPConfig } from './types';

export const mcpRegistry: MCPConfig[] = [
  // Payments
  {
    id: 'stripe-mcp',
    name: 'Stripe MCP',
    category: 'payments',
    npmPackage: '@stripe/mcp',
    githubRepo: 'stripe/ai', // monorepo containing @stripe/mcp
    description: 'Official Stripe MCP server',
    website: 'https://mcp.stripe.com',
  },
  {
    id: 'stripe-agent-toolkit',
    name: 'Stripe Agent Toolkit',
    category: 'payments',
    npmPackage: '@stripe/agent-toolkit',
    githubRepo: 'stripe/ai', // was renamed from stripe/agent-toolkit
    description: 'LangChain/Vercel AI SDK integration',
  },
  {
    id: 'paypal-mcp',
    name: 'PayPal MCP',
    category: 'payments',
    npmPackage: '@paypal/mcp', // was incorrectly @anthropic/paypal-mcp
    githubRepo: 'paypal/agent-toolkit',
    description: 'PayPal agent toolkit',
  },
  {
    id: 'square-mcp',
    name: 'Square MCP',
    category: 'payments',
    npmPackage: null,
    githubRepo: 'square/square-mcp-server', // was incorrectly square/square-mcp
    description: 'Square payments MCP',
  },

  // Commerce
  {
    id: 'shopify-dev-mcp',
    name: 'Shopify Dev MCP',
    category: 'commerce',
    npmPackage: '@shopify/dev-mcp',
    githubRepo: null, // closed source - no public repo
    description: 'Official Shopify developer MCP',
  },
  {
    id: 'shopify-mcp',
    name: 'Shopify MCP',
    category: 'commerce',
    npmPackage: 'shopify-mcp',
    githubRepo: 'GeLi2001/shopify-mcp', // from npm repository field
    description: 'Community Shopify MCP',
  },
  {
    id: 'shopify-storefront-mcp',
    name: 'Shopify Storefront MCP',
    category: 'commerce',
    npmPackage: '@wolfielabs/shopify-storefront-mcp-server',
    githubRepo: null,
    description: 'Shopify storefront integration',
  },
  {
    id: 'shopify-mcp-server',
    name: 'Shopify MCP Server',
    category: 'commerce',
    npmPackage: 'shopify-mcp-server',
    githubRepo: null,
    description: 'Community Shopify server',
  },

  // Crypto/Stablecoins
  {
    id: 'x402-mcp',
    name: 'x402 MCP',
    category: 'crypto',
    npmPackage: 'x402-mcp',
    githubRepo: 'ethanniser/x402-mcp', // from npm repository field
    description: 'Vercel x402 protocol integration',
  },
  {
    id: 'mcpay',
    name: 'MCPay',
    category: 'crypto',
    npmPackage: 'mcpay',
    githubRepo: 'microchipgnu/MCPay',
    description: 'x402 payment infrastructure',
  },
  {
    id: 'coingecko-mcp',
    name: 'CoinGecko MCP',
    category: 'crypto',
    npmPackage: 'coingecko-mcp',
    githubRepo: null,
    description: 'Crypto price data',
  },
  {
    id: 'hive-crypto-mcp',
    name: 'Hive Intelligence',
    category: 'crypto',
    npmPackage: null, // hive-crypto-mcp doesn't exist on npm
    githubRepo: 'hive-intel/hive-crypto-mcp',
    description: 'DeFi analytics',
  },
  {
    id: 'near-mcp',
    name: 'NEAR MCP',
    category: 'crypto',
    npmPackage: '@nearai/near-mcp', // was incorrectly near-mcp
    githubRepo: 'nearai/near-mcp',
    description: 'NEAR blockchain integration',
  },
  {
    id: 'coinbase-cdp',
    name: 'Coinbase CDP',
    category: 'crypto',
    npmPackage: '@coinbase/agentkit-model-context-protocol',
    githubRepo: 'coinbase/agentkit', // monorepo for agentkit packages
    description: 'Coinbase Developer Platform MCP',
  },
];

export function getMCPsByCategory(category: string | null): MCPConfig[] {
  if (!category || category === 'all') {
    return mcpRegistry;
  }
  return mcpRegistry.filter((mcp) => mcp.category === category);
}
