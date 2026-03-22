import { apiService } from "./api";
import type { LanguageOption, RegionOption } from "./userService";

const META_ENDPOINTS = {
  languages: "/meta/languages",
  regions: "/meta/regions",
};

export const metaService = {
  async getLanguages(query?: string): Promise<LanguageOption[]> {
    return apiService.get<LanguageOption[]>(META_ENDPOINTS.languages, { query });
  },

  async getRegions(params: {
    level?: "country" | "province" | "city";
    parentCode?: string;
    countryCode?: string;
    query?: string;
  }): Promise<RegionOption[]> {
    return apiService.get<RegionOption[]>(META_ENDPOINTS.regions, params);
  },
};

export default metaService;
