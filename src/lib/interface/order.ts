interface Order {
  ID: number;
  user_id: number;
  car_id: number;
  service_type: string;
  address: string | null;
  order_time: Date;
  price: number;
  duration: number;
  status: string;
  car: Car;
  services: string;
  user: User;
}
