export type RootStackParamList = {
  Home: {
    goToMain?: {
      ok: boolean;
    };
  };
  Camera: { token: string; userIds: string[] };
};
