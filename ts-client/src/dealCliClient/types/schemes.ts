// Schemes that client composes and return (aka REST API).

export interface OfferDetail {
  id: string
  effectors: Array<Effector>
  peerIds: Array<string>
}

export type Effector = {
  cid: string;
  description: string;
};
