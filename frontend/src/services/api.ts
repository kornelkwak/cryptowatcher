const API_URL = 'http://localhost:4000';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Request-Method': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Request-Headers': 'Content-Type, Accept',
};

const defaultOptions: RequestInit = {
  mode: 'cors',
  credentials: 'include',
  headers: defaultHeaders,
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithError(url: string, options: RequestInit = {}) {
  let lastError;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetchWithTimeout(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      lastError = error;
      if (error.name == 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      if (i < MAX_RETRIES - 1) {
        await wait(Math.pow(2, i) * 1000);
        continue;
      }
    }
  }

  console.error('API Error:', lastError);
  throw new Error(
    `Failed to connect to the server after ${MAX_RETRIES} attempts. Please check your connection.`
  );
}

type ApiToken = {
  symbol: string;
  name: string;
  priceUsd: number;
  lastUpdated: string;
  favorite: boolean;
};

export type Token = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  liked: boolean;
  amount: number;
  comment: string;
};

export const fetchTokens = async (): Promise<{ data: Token[] }> => {
  try {
    const [tokensResponse, portfolioTokens] = await Promise.all([
      fetchWithError(`${API_URL}/tokens`),
      fetchPortfolio()
    ]);

    const portfolioSymbols = new Set(portfolioTokens.map(t => t.symbol.toLowerCase()));

    const transformedData: Token[] = tokensResponse.map((token: ApiToken) => ({
      id: token.symbol.toLowerCase(),
      name: token.name,
      symbol: token.symbol,
      price: token.priceUsd,
      liked: token.favorite || portfolioSymbols.has(token.symbol.toLowerCase()),
      amount: portfolioTokens.find(t => t.symbol.toLowerCase() === token.symbol.toLowerCase())?.amount || 0,
      comment: ''
    }));
    
    return { data: transformedData };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const likeToken = async (id: string): Promise<void> => {
  await fetchWithError(`${API_URL}/tokens/${id}/favorite`, {
    method: 'PATCH',
  });
};

export const unlikeToken = async (id: string): Promise<void> => {
  await fetchWithError(`${API_URL}/tokens/${id}/favorite`, {
    method: 'PATCH',
  });
};

type PortfolioResponse = {
  totalValue: number;
  tokens: Token[];
};

export const fetchPortfolioValue = async (): Promise<{ data: number }> => {
  try {
    const portfolio = await fetchWithError(`${API_URL}/portfolio`);
    return { data: portfolio.totalValue || 0 };
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return { data: 0 }; // Return 0 if portfolio doesn't exist yet
    }
    throw error;
  }
};

export const fetchPortfolio = async (): Promise<Token[]> => {
  try {
    const response = await fetchWithError(`${API_URL}/portfolio`);
    return response.tokens || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return []; // Return empty array if portfolio doesn't exist yet
    }
    throw error;
  }
};

export const setTokenAmount = async (
  id: string, 
  amount: number, 
  comment?: string
): Promise<void> => {
  await fetchWithError(`${API_URL}/portfolio/set`, {
    method: 'POST',
    body: JSON.stringify({ 
      symbol: id.toUpperCase(),
      amount,
      comment 
    }),
  });
};
