export interface Alert {
  id: string;
  type: "STOCK" | "EXPIRY" | "REQUEST" | "LAUNDRY" | "TRIP";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  createdAt: string;
  isRead: boolean;
  linkUrl?: string;
}
