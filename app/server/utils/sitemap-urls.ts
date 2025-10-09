interface UrlItem {
  loc: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
}

interface HttpOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

// 简易的http工具函数
export async function http(path: string, options: HttpOptions = {}) {
  try {
    const baseUrl = process.env.NUXT_PUBLIC_API_URL || "http://localhost:3000";
    const {
      method = "GET",
      headers = {
        "Content-Type": "application/json",
      },
      body,
      params,
    } = options;
    let fullUrl = baseUrl + path;
    if (params) {
      const query = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      fullUrl += `?${query}`;
    }
    const res: Record<string, any> = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err) {
    console.error(`HTTP request failed: ${path}`, err);
    throw err;
  }
}

// 获取site map urls
export async function getSitemapUrls(): Promise<UrlItem[]> {
  try {
    const result: UrlItem[] = [];
    const [articlesRes] = await Promise.all([
      http("/article/reception/searchArticle", {
        method: "POST",
        body: { data: {} },
      }),
    ]);
    result.push(
      ...articlesRes?.rows?.map((item: any) => ({
        loc: `/log/article/detail/${item.id}`,
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date(item.updatedTime).toISOString(),
      }))
    );
    return result;
  } catch (err) {
    console.error("Error fetching sitemap URLs:", err);
    return [];
  }
}
