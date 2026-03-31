/**
 * MyMe App - Market/Square Service
 * 市场匹配服务 - 恋人匹配、交友匹配、工作匹配
 */

import { apiService } from "./api";

export interface MatchProfileResponse {
  id: string;
  nickname: string;
  avatar: string | null;
  matchRate: number;
  matchReasons: string[];
  commonInterests?: string[];
  skills?: string[];
  role?: "jobseeker" | "recruiter";
}

export interface MatchResult {
  matches: MatchProfileResponse[];
  total: number;
  aiSummary: string;
}

export interface LoverMatchRequest {
  gender?: string;
  ageRange?: string;
  city?: string;
  aiMatch?: boolean;
}

export interface FriendMatchRequest {
  interests?: string[];
  city?: string;
}

export interface WorkMatchRequest {
  role: "jobseeker" | "recruiter";
  jobType: string;
  experience?: string;
  city?: string;
}

const SQUARE_ENDPOINTS = {
  loverMatch: "/square/lover-match",
  friendMatch: "/square/friend-match",
  workMatch: "/square/work-match",
};

export const squareService = {
  /**
   * 恋人匹配：基于 M4+M5+M6+M7+M8 的情感相容性分析
   */
  async loverMatch(request: LoverMatchRequest): Promise<MatchResult> {
    return apiService.post<MatchResult>(SQUARE_ENDPOINTS.loverMatch, request);
  },

  /**
   * 交友匹配：基于 M4+M6+M9 的兴趣相似性匹配
   */
  async friendMatch(request: FriendMatchRequest): Promise<MatchResult> {
    return apiService.post<MatchResult>(SQUARE_ENDPOINTS.friendMatch, request);
  },

  /**
   * 工作匹配
   */
  async workMatch(request: WorkMatchRequest): Promise<MatchResult> {
    return apiService.post<MatchResult>(SQUARE_ENDPOINTS.workMatch, request);
  },
};

export default squareService;
