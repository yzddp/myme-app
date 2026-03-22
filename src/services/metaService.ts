import { apiService } from "./api";
import type { LanguageOption, RegionOption } from "./userService";

const META_ENDPOINTS = {
  languages: "/meta/languages",
  regions: "/meta/regions",
};

export const metaService = {
  async getLanguages(query?: string): Promise<LanguageOption[]> {
    const response = await apiService.get<any>(META_ENDPOINTS.languages, { query });
    if (Array.isArray(response)) {
      return response;
    }
    if (Array.isArray(response?.items)) {
      return response.items;
    }
    return [];
  },

  async getRegions(params: {
    level?: "country" | "province" | "city";
    parentCode?: string;
    countryCode?: string;
    query?: string;
  }): Promise<RegionOption[]> {
    const response = await apiService.get<any>(META_ENDPOINTS.regions, params);
    if (Array.isArray(response)) {
      return response;
    }
    if (Array.isArray(response?.items)) {
      return response.items;
    }
    return [];
  },
};

export default metaService;
