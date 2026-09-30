export type UserId = number & {
  readonly __brand: 'UserId';
};

export type User = {
  id: UserId;
  username: string;
  createdAt: Date;
};
