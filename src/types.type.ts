export type JokeResponse = {
  body: {
    _id: string;
    punchline: string;
    setup: string;
    type: string;
  }[];
  success: boolean;
};

export type Joke = { punchline: string; setup: string; type: string };
