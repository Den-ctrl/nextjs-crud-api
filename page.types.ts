export type PostDataType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type CommentType = {
  id: number;
  name: string;
  email: string;
  body: string;
};

export type UserType = {
  id: number;
  name: string;
};

export type TodoType = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type InputType = {
  email: string;
  password: string;
};
