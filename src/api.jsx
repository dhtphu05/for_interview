import axios from "axios";

const API_BASE = "https://api.sorium.openverse.tech/api";
const LIMIT = 10;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

function buildTradersUrl(params = {}) {
  const { page = 1, limit = 10, ...otherParams } = params;
  const url = new URL(`${API_BASE}/v1/traders`);

  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  Object.entries(otherParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value.toString());
    }
  });

  return url.toString();
}

function extractItems(json) {
  return json.data || [];
}

function extractTotal(json) {
  return json.total || json.data?.length || 0;
}

function normalizeTrader(trader, index) {
  return {
    wallet: trader.wallet,
    tag: trader.tag,
    // Metric data
    pnl: parseFloat(trader.metric?.pnl || 0),
    realized: parseFloat(trader.metric?.realized || 0),
    unrealized: parseFloat(trader.metric?.unrealized || 0),
    roi: parseFloat(trader.metric?.roi || 0),
    winRate: parseFloat(trader.metric?.winRate || 0),
    buyUsdAmount: parseFloat(trader.metric?.buyUsdAmount || 0),
    sellUsdAmount: parseFloat(trader.metric?.sellUsdAmount || 0),
    buyCount: parseInt(trader.metric?.buyCount || 0),
    sellCount: parseInt(trader.metric?.sellCount || 0),
    lastActiveAt: trader.metric?.lastActiveAt,
    ...trader,
  };
}

export async function getTraders(params = {}, options = {}) {
  const { signal } = options;
  const normalize = options.normalize !== false;

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const url = buildTradersUrl({ ...params, page, limit });

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    const json = await res.json();
    const items = extractItems(json);
    const total = extractTotal(json);

    const outItems = normalize
      ? items.map((t, i) => normalizeTrader(t, i))
      : items;

    return { items: outItems, total, page, limit, raw: json };
  } catch (error) {
    console.error("Error fetching traders:", error);
    throw error;
  }
}
