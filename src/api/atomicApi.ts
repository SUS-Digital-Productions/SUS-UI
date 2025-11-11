/**
 * AtomicAssets API service for WAX blockchain NFT data
 * Used with TanStack Query for data fetching
 */

/**
 * Lightweight AtomicAssets API client
 * Implements common endpoints used by the UI and provides strict query building
 * See: https://wax-atomic.alcor.exchange/docs/#/collections/get_atomicassets_v1_collections
 */

export interface Collection {
  collection_name: string;
  name: string;
  img: string;
  author: string;
  allow_notify: boolean;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  created_at_block: string;
  created_at_time: string;
  data?: {
    img?: string;
    name?: string;
    url?: string;
    images?: string;
    socials?: string;
    description?: string;
    creator_info?: string;
    [key: string]: unknown;
  };
}

export interface Asset {
  asset_id: string;
  collection: {
    collection_name: string;
    name: string;
    img: string;
  };
  schema: {
    schema_name: string;
  };
  template: {
    template_id: string;
    max_supply?: string;
    issued_supply?: string;
  };
  name: string;
  img: string;
  owner: string;
  template_mint?: number;
  data: Record<string, unknown>;
}

export interface CollectionsResponse {
  data: Collection[];
  success: boolean;
}

export interface AssetsResponse {
  data: Asset[];
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  success: boolean;
  query_time?: string | number;
  page?: number;
  limit?: number;
}

interface CommonFetchParams {
  endpoint: string;
  page?: number;
  limit?: number;
  order?: string;
  sort?: string;
  match?: string; // Search parameter for collections
}

interface FetchAssetsParams extends CommonFetchParams {
  owner: string;
  collection_name?: string;
}

type Maybe<T> = T | undefined | null;

/** Helper: build query string ignoring undefined/null values and arrays become comma-separated */
const buildQuery = (params: Record<string, Maybe<string | number | boolean | string[]>>) => {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      // AtomicAssets API accepts comma-separated values for arrays
      if (v.length > 0) qp.append(k, v.join(","));
    } else {
      qp.append(k, String(v));
    }
  });
  return qp.toString();
};

/**
 * Validate order direction — AtomicAssets API expects 'asc' or 'desc'
 * Returns normalized value or undefined if invalid
 */
const validateOrder = (o?: string): "asc" | "desc" | undefined => {
  if (!o) return undefined;
  const v = o.toLowerCase();
  return v === "asc" || v === "desc" ? (v as "asc" | "desc") : undefined;
};

/**
 * Validate sort field — common AtomicAssets sort fields
 * Returns the value if valid, undefined otherwise
 */
const validateSort = (s?: string): string | undefined => {
  if (!s) return undefined;
  const validSorts = [
    "created",
    "updated",
    "transferred",
    "minted",
    "template_mint",
    "name",
    "asset_id",
    "collection_name",
  ];
  return validSorts.includes(s) ? s : undefined;
};

/**
 * Fetch collections from AtomicAssets API
 * Returns the raw JSON response — the UI hooks will read `data` and `success`
 * 
 * AtomicAssets API parameter semantics:
 * - order: direction (asc or desc)
 * - sort: field to sort by (created, updated, collection_name, etc.)
 * - match: search term to filter collections (searches in collection_name and name)
 */
export const fetchCollections = async (
  params: CommonFetchParams
): Promise<PaginatedResponse<Collection>> => {
  const { endpoint, page = 1, limit = 12, order, sort, match } = params;

  // Validate and normalize parameters
  const validatedOrder = validateOrder(order) || "desc";
  const validatedSort = validateSort(sort) || "created";

  const queryObj: Record<string, string | number> = {
    page, 
    limit, 
    order: validatedOrder, 
    sort: validatedSort
  };

  // Add match parameter if provided
  if (match && match.trim()) {
    queryObj.match = match.trim();
  }

  const qs = buildQuery(queryObj);

  const res = await fetch(`${endpoint.replace(/\/$/, "")}/atomicassets/v1/collections?${qs}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch collections: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/**
 * Fetch assets/NFTs from AtomicAssets API
 */
/**
 * Fetch assets (NFTs) for a specific owner with optional collection filter
 * 
 * AtomicAssets API parameter semantics:
 * - order: direction (asc or desc)
 * - sort: field to sort by (created, updated, transferred, minted, etc.)
 */
export const fetchAssets = async (params: FetchAssetsParams): Promise<PaginatedResponse<Asset>> => {
  const { endpoint, owner, collection_name, page = 1, limit = 12, order, sort } = params;

  // Validate and normalize parameters
  const validatedOrder = validateOrder(order) || "desc";
  const validatedSort = validateSort(sort) || "transferred";

  const queryObj: Record<string, string | number> = {
    owner,
    page,
    limit,
    order: validatedOrder,
    sort: validatedSort,
  };

  if (collection_name) {
    queryObj.collection_name = collection_name;
  }

  const qs = buildQuery(queryObj);
  const url = `${endpoint.replace(/\/$/, "")}/atomicassets/v1/assets?${qs}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch assets: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/**
 * Fetch a single collection by name
 */
export const fetchCollectionByName = async (endpoint: string, collection_name: string) => {
  const res = await fetch(`${endpoint.replace(/\/$/, "")}/atomicassets/v1/collections/${encodeURIComponent(collection_name)}`);
  if (!res.ok) throw new Error(`Failed to fetch collection ${collection_name}: ${res.status} ${res.statusText}`);
  return res.json();
};

/**
 * Fetch a single asset by id
 */
export const fetchAssetById = async (endpoint: string, asset_id: string | number) => {
  const res = await fetch(`${endpoint.replace(/\/$/, "")}/atomicassets/v1/assets/${encodeURIComponent(String(asset_id))}`);
  if (!res.ok) throw new Error(`Failed to fetch asset ${asset_id}: ${res.status} ${res.statusText}`);
  return res.json();
};

/**
 * Fetch templates — useful for template-specific views
 */
export const fetchTemplates = async (endpoint: string, params: { page?: number; limit?: number; collection_name?: string } = {}) => {
  const { page = 1, limit = 12, collection_name } = params;
  const qs = buildQuery({ page, limit });
  const base = `${endpoint.replace(/\/$/, "")}/atomicassets/v1/templates`;
  const url = collection_name ? `${base}?${qs}&collection_name=${encodeURIComponent(collection_name)}` : `${base}?${qs}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch templates: ${res.status} ${res.statusText}`);
  return res.json();
};

/**
 * Fetch schemas
 */
export const fetchSchemas = async (endpoint: string, params: { page?: number; limit?: number; collection_name?: string } = {}) => {
  const { page = 1, limit = 12, collection_name } = params;
  const qs = buildQuery({ page, limit });
  const base = `${endpoint.replace(/\/$/, "")}/atomicassets/v1/schemas`;
  const url = collection_name ? `${base}?${qs}&collection_name=${encodeURIComponent(collection_name)}` : `${base}?${qs}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch schemas: ${res.status} ${res.statusText}`);
  return res.json();
};

export default {
  fetchCollections,
  fetchCollectionByName,
  fetchAssets,
  fetchAssetById,
  fetchTemplates,
  fetchSchemas,
};
