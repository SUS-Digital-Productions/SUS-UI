/**
 * WAX Blockchain RPC API Client
 * Based on Hyperion v2 History API
 * Swagger docs: https://proton.protonuk.io/v2/docs
 */

// ============================================
// CONSTANTS
// ============================================

// Using text/plain to avoid CORS preflight
// EOSIO nodes still parse JSON from text/plain Content-Type
const JSON_HEADERS = {
  'Content-Type': 'text/plain',
};

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AccountInfo {
  account_name: string;
  head_block_num: number;
  head_block_time: string;
  privileged: boolean;
  last_code_update: string;
  created: string;
  core_liquid_balance?: string;
  ram_quota: number;
  net_weight: number;
  cpu_weight: number;
  net_limit: {
    used: number;
    available: number;
    max: number;
  };
  cpu_limit: {
    used: number;
    available: number;
    max: number;
  };
  ram_usage: number;
  permissions: Array<{
    perm_name: string;
    parent: string;
    required_auth: {
      threshold: number;
      keys: Array<{
        key: string;
        weight: number;
      }>;
      accounts: Array<{ permission: { actor: string; permission: string }; weight: number }>;
      waits: Array<{ wait_sec: number; weight: number }>;
    };
  }>;
  total_resources?: {
    owner: string;
    net_weight: string;
    cpu_weight: string;
    ram_bytes: number;
  };
  self_delegated_bandwidth?: {
    from: string;
    to: string;
    net_weight: string;
    cpu_weight: string;
  };
  refund_request?: {
    owner: string;
    request_time: string;
    net_amount: string;
    cpu_amount: string;
  };
  voter_info?: {
    owner: string;
    proxy: string;
    producers: string[];
    staked: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    is_proxy: number;
    last_claim_time?: string;
  };
  rex_info?: {
    version: number;
    owner: string;
    vote_stake: string;
    rex_balance: string;
    matured_rex: number;
    rex_maturities: Array<{ first: string; second: number }>;
  };
}

// ============================================
// REQUEST PARAMETER INTERFACES
// ============================================

export interface GetKeyAccountsParams {
  public_key: string;
}

export interface GetControlledAccountsParams {
  controlling_account: string;
}

export interface GetTableRowsParams {
  code: string; // Contract account name
  table: string; // Table name
  scope: string; // Scope of the table (usually contract or account name)
  lower_bound?: string | number;
  upper_bound?: string | number;
  limit?: number;
  key_type?: string; // i64, i128, i256, float64, float128, sha256, ripemd160
  index_position?: number; // 1-10 for secondary indices
  reverse?: boolean;
  show_payer?: boolean;
}

export interface GetTableByScopeParams {
  code: string;
  table?: string;
  lower_bound?: string;
  upper_bound?: string;
  limit?: number;
  reverse?: boolean;
}

export interface GetCurrencyBalanceParams {
  code: string; // Token contract (e.g., "eosio.token")
  account: string; // Account to check balance
  symbol?: string; // Token symbol (e.g., "WAX")
}

export interface GetProducersParams {
  json?: boolean;
  lower_bound?: string;
  limit?: number;
}

export interface GetBlockParams {
  block_num_or_id: string | number;
}

export interface GetInfoResponse {
  server_version: string;
  chain_id: string;
  head_block_num: number;
  last_irreversible_block_num: number;
  last_irreversible_block_id: string;
  head_block_id: string;
  head_block_time: string;
  head_block_producer: string;
  virtual_block_cpu_limit: number;
  virtual_block_net_limit: number;
  block_cpu_limit: number;
  block_net_limit: number;
  server_version_string: string;
}

export interface GetBlockResponse {
  timestamp: string;
  producer: string;
  confirmed: number;
  previous: string;
  transaction_mroot: string;
  action_mroot: string;
  schedule_version: number;
  new_producers: null | {
    version: number;
    producers: Array<{
      producer_name: string;
      block_signing_key: string;
    }>;
  };
  producer_signature: string;
  transactions: Array<{
    status: string;
    cpu_usage_us: number;
    net_usage_words: number;
    trx: string | {
      id: string;
      signatures: string[];
      compression: string;
      packed_context_free_data: string;
      context_free_data: unknown[];
      packed_trx: string;
      transaction: {
        expiration: string;
        ref_block_num: number;
        ref_block_prefix: number;
        max_net_usage_words: number;
        max_cpu_usage_ms: number;
        delay_sec: number;
        context_free_actions: unknown[];
        actions: Array<{
          account: string;
          name: string;
          authorization: Array<{
            actor: string;
            permission: string;
          }>;
          data: Record<string, unknown>;
        }>;
      };
    };
  }>;
  id: string;
  block_num: number;
  ref_block_prefix: number;
}

// ============================================
// API CLIENT
// ============================================

/**
 * Get account information
 * Uses v1/chain endpoint (standard EOSIO nodes)
 */
export async function fetchAccount(
  endpoint: string,
  account: string
): Promise<AccountInfo> {
  console.log('Fetching account:', account, 'from endpoint:', endpoint);
  
  const url = `${endpoint}/v1/chain/get_account`;
  console.log('Full URL:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ account_name: account }),
  });
  
  console.log('Response status:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed to fetch account: ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log('Account data received:', data);
  return data;
}

/**
 * Get accounts associated with a public key
 * Uses v1/history endpoint (standard EOSIO nodes)
 */
export async function fetchKeyAccounts(
  endpoint: string,
  params: GetKeyAccountsParams
): Promise<{ account_names: string[] }> {
  const response = await fetch(`${endpoint}/v1/history/get_key_accounts`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ public_key: params.public_key }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch key accounts: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get accounts controlled by a specific account
 * Uses v1/history endpoint (standard EOSIO nodes)
 */
export async function fetchControlledAccounts(
  endpoint: string,
  params: GetControlledAccountsParams
): Promise<{ controlled_accounts: string[] }> {
  const response = await fetch(
    `${endpoint}/v1/history/get_controlled_accounts`,
    {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ controlling_account: params.controlling_account }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch controlled accounts: ${response.statusText}`);
  }
  
  return response.json();
}

// ============================================
// CHAIN API (v1/chain methods)
// ============================================

/**
 * Get blockchain info (chain_id, head_block, etc.)
 */
export async function fetchChainInfo(endpoint: string): Promise<GetInfoResponse> {
  const response = await fetch(`${endpoint}/v1/chain/get_info`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch chain info: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get block information by block number or ID
 */
export async function fetchBlock(
  endpoint: string,
  params: GetBlockParams
): Promise<GetBlockResponse> {
  const response = await fetch(`${endpoint}/v1/chain/get_block`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ block_num_or_id: params.block_num_or_id }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch block: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get table rows from a smart contract
 */
export async function fetchTableRows<T = Record<string, unknown>>(
  endpoint: string,
  params: GetTableRowsParams
): Promise<{
  rows: T[];
  more: boolean;
  next_key?: string;
}> {
  const body: Record<string, unknown> = {
    json: true,
    code: params.code,
    table: params.table,
    scope: params.scope,
  };

  if (params.lower_bound !== undefined) body.lower_bound = params.lower_bound;
  if (params.upper_bound !== undefined) body.upper_bound = params.upper_bound;
  if (params.limit !== undefined) body.limit = params.limit;
  if (params.key_type !== undefined) body.key_type = params.key_type;
  if (params.index_position !== undefined) body.index_position = params.index_position;
  if (params.reverse !== undefined) body.reverse = params.reverse;
  if (params.show_payer !== undefined) body.show_payer = params.show_payer;

  const response = await fetch(`${endpoint}/v1/chain/get_table_rows`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch table rows: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get table scopes for a contract
 */
export async function fetchTableByScope(
  endpoint: string,
  params: GetTableByScopeParams
): Promise<{
  rows: Array<{
    code: string;
    scope: string;
    table: string;
    payer: string;
    count: number;
  }>;
  more: string;
}> {
  const body: Record<string, unknown> = {
    json: true,
    code: params.code,
  };

  if (params.table !== undefined) body.table = params.table;
  if (params.lower_bound !== undefined) body.lower_bound = params.lower_bound;
  if (params.upper_bound !== undefined) body.upper_bound = params.upper_bound;
  if (params.limit !== undefined) body.limit = params.limit;
  if (params.reverse !== undefined) body.reverse = params.reverse;

  const response = await fetch(`${endpoint}/v1/chain/get_table_by_scope`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch table by scope: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get currency balance for an account
 */
export async function fetchCurrencyBalance(
  endpoint: string,
  params: GetCurrencyBalanceParams
): Promise<string[]> {
  const body: Record<string, string> = {
    code: params.code,
    account: params.account,
  };

  if (params.symbol) {
    body.symbol = params.symbol;
  }

  const response = await fetch(`${endpoint}/v1/chain/get_currency_balance`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch currency balance: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get currency stats (supply, max_supply, issuer)
 */
export async function fetchCurrencyStats(
  endpoint: string,
  params: { code: string; symbol: string }
): Promise<Record<string, {
  supply: string;
  max_supply: string;
  issuer: string;
}>> {
  const response = await fetch(`${endpoint}/v1/chain/get_currency_stats`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch currency stats: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get producers list
 */
export async function fetchProducers(
  endpoint: string,
  params: GetProducersParams = {}
): Promise<{
  rows: Array<{
    owner: string;
    total_votes: string;
    producer_key: string;
    is_active: number;
    url: string;
    unpaid_blocks: number;
    last_claim_time: string;
    location: number;
  }>;
  total_producer_vote_weight: string;
  more: string;
}> {
  const body: Record<string, unknown> = {
    json: params.json !== false,
    limit: params.limit || 50,
  };

  if (params.lower_bound) body.lower_bound = params.lower_bound;

  const response = await fetch(`${endpoint}/v1/chain/get_producers`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch producers: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get ABI for a contract account
 */
export async function fetchAbi(
  endpoint: string,
  accountName: string
): Promise<{
  account_name: string;
  abi: {
    version: string;
    types: unknown[];
    structs: unknown[];
    actions: unknown[];
    tables: unknown[];
    ricardian_clauses: unknown[];
    error_messages: unknown[];
    abi_extensions: unknown[];
    variants: unknown[];
  };
}> {
  const response = await fetch(`${endpoint}/v1/chain/get_abi`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ account_name: accountName }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ABI: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get smart contract code
 */
export async function fetchCode(
  endpoint: string,
  accountName: string
): Promise<{
  account_name: string;
  code_hash: string;
  wast: string;
  wasm: string;
  abi: unknown;
}> {
  const response = await fetch(`${endpoint}/v1/chain/get_code`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ account_name: accountName, code_as_wasm: true }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch code: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get raw ABI for a contract
 */
export async function fetchRawAbi(
  endpoint: string,
  accountName: string
): Promise<{
  account_name: string;
  code_hash: string;
  abi_hash: string;
  abi: string;
}> {
  const response = await fetch(`${endpoint}/v1/chain/get_raw_abi`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ account_name: accountName }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch raw ABI: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get raw code and ABI
 */
export async function fetchRawCodeAndAbi(
  endpoint: string,
  accountName: string
): Promise<{
  account_name: string;
  wasm: string;
  abi: string;
}> {
  const response = await fetch(`${endpoint}/v1/chain/get_raw_code_and_abi`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ account_name: accountName }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch raw code and ABI: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get required keys for a transaction
 */
export async function fetchRequiredKeys(
  endpoint: string,
  params: {
    transaction: unknown;
    available_keys: string[];
  }
): Promise<{ required_keys: string[] }> {
  const response = await fetch(`${endpoint}/v1/chain/get_required_keys`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch required keys: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Push a signed transaction to the blockchain
 */
export async function pushTransaction(
  endpoint: string,
  signedTransaction: {
    signatures: string[];
    compression: number;
    packed_context_free_data: string;
    packed_trx: string;
  }
): Promise<{
  transaction_id: string;
  processed: {
    id: string;
    block_num: number;
    block_time: string;
    receipt: {
      status: string;
      cpu_usage_us: number;
      net_usage_words: number;
    };
    elapsed: number;
    net_usage: number;
    scheduled: boolean;
    action_traces: unknown[];
    account_ram_delta: unknown;
  };
}> {
  const response = await fetch(`${endpoint}/v1/chain/push_transaction`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(signedTransaction),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to push transaction: ${JSON.stringify(error)}`);
  }
  
  return response.json();
}

