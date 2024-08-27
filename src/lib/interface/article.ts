interface Article {
    ID: number;
    user_id: number;
    status: boolean;
    photo_url : string;
    title : string;
    content : string;
    user: User;
    category: Category;
    tags: Tag[];
    publish_date: string;
  }
  