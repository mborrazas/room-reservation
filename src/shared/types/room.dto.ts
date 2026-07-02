export interface RoomDto {
  id: string;
  name: string;
  capacity: number;
  floor?: number;
  amenities: string[];
  isActive: boolean;
}
