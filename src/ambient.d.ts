interface User {
  id: string;
  username: string;
}

interface Puzzle {
  id: string;
  glyphs: string[];
  solution: string;
  createdBy: User;
  createdAt: Date;
  completion?: Date;
}

