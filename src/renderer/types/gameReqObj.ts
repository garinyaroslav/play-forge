export interface IGameReqObj {
  id: number;
  title: string;
  description: string;
  developerName: string;
  rating: number;
  price: number;
  copiesSold: number;
  gameGenreId: number;
  relDate: number;
  image: Uint8Array;
}
