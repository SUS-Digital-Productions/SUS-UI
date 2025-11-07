/**
 * Hyperion v2 History API Client
 * These endpoints require Hyperion-enabled nodes
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface HyperionAction {
  '@timestamp': string;
  timestamp: string;
  block_num: number;
  trx_id: string;
  act: {
    account: string;
    name: string;
    authorization: Array<{
      actor: string;
      permission: string;
    }>;
    data: Record<string, unknown>;
  };
  notified: string[];
  cpu_usage_us?: number;
  net_usage_words?: number;
  account_ram_deltas?: Array<{
    account: string;
    delta: number;
  }>;
  global_sequence: number;
  producer: string;
  action_ordinal: number;
  creator_action_ordinal: number;
}

export interface HyperionToken {
  symbol: string;
  precision: number;
  amount: number;
  contract: string;
}

export interface GetTokensParams {
  account: string;
  limit?: number;
  skip?: number;
}

export interface GetActionsParams {
  account?: string;
  filter?: string;
  skip?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  after?: string;
  before?: string;
  transfer_to?: string;
  transfer_from?: string;
  transfer_symbol?: string;
  act_name?: string;
  act_account?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get token balances for an account from Hyperion API
 */
export async function fetchTokens(
  endpoint: string,
  account: string
): Promise<{ account: string; tokens: HyperionToken[] }> {
  const queryParams = new URLSearchParams({
    account: account,
  });

  const response = await fetch(`${endpoint}/v2/state/get_tokens?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get recent actions for an account from Hyperion API
 */
export async function fetchActions(
  endpoint: string,
  account: string,
  limit: number = 10
): Promise<{ actions: HyperionAction[]; total: { value: number; relation: string } }> {
  const queryParams = new URLSearchParams({
    account: account,
    limit: String(limit),
    sort: 'desc',
  });

  const response = await fetch(`${endpoint}/v2/history/get_actions?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch actions: ${response.statusText}`);
  }
  
  return response.json();
}
