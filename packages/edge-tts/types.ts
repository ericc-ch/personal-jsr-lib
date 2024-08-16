export type GenerateTTSOptions = {
  body: {
    text: string;
    voice?: string;
    subtitle?: boolean;
  };
};

export type GenerateTTSResponse = {
  taskId: string;
};

export type GetTTSStatusOptions = {
  taskId: string;
};

export type GetTTSStatusResponse = {
  error: string | null;
  status: "pending" | "done" | "error";
  url: string | null;
};

export type DownloadTTSItemOptions = {
  taskId: string;
};
