export interface OrderByInABC {
  orderType: "asc" | "desc";
}

export interface OffersOrderByIn extends OrderByInABC {
  orderBy: "createdAt";
}
