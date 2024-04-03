export interface OrderByInABC {
  orderType: "asc" | "desc";
}

export interface OffersOrderByIn extends OrderByInABC {
  orderBy: "createdAt";
}

export interface DealsOrderByIn extends OrderByInABC {
  orderBy: "createdAt";
}
