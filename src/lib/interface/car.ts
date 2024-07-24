interface Car {
  ID: number;
  license_plat: string;
  user_id: number;
  car_type_id: number;
  color_id: number;
  frame_number: string;
  engine_number: string;
  kilometer: number;
  photo_url: string | undefined;
  car_type: CarType;
  color: Color;
}
