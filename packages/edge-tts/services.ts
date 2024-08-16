import { ofetch } from "ofetch";
import type {
  DownloadTTSItemOptions,
  GenerateTTSOptions,
  GenerateTTSResponse,
  GetTTSStatusOptions,
  GetTTSStatusResponse,
} from "./types.ts";

type TTSServiceOptions = {
  TTS_BASE_URL: string;
  TTS_API_KEY: string;
};

export class TTSService {
  private api: ReturnType<typeof ofetch.create>;

  constructor(options: TTSServiceOptions) {
    this.api = ofetch.create({
      baseURL: options.TTS_BASE_URL,
      headers: {
        "X-API-Key": options.TTS_API_KEY,
      },
    });
  }

  generateTTS = ({
    body,
  }: GenerateTTSOptions): Promise<GenerateTTSResponse> => {
    return this.api<GenerateTTSResponse>("/tts", {
      method: "POST",
      body,
    });
  };

  getTTSStatus = ({
    taskId,
  }: GetTTSStatusOptions): Promise<GetTTSStatusResponse> => {
    return this.api<GetTTSStatusResponse>(`/tts/${taskId}`, {
      method: "GET",
    });
  };

  waitForTTS = (
    options: GetTTSStatusOptions,
    delay: number = 100,
  ): Promise<GetTTSStatusResponse> => {
    return new Promise<GetTTSStatusResponse>((resolve, reject) => {
      const interval = setInterval(async () => {
        const response = await this.getTTSStatus(options);
        if (response.status === "done") {
          clearInterval(interval);
          resolve(response);
        } else if (response.status === "error") {
          clearInterval(interval);
          reject(response);
        }
      }, delay);
    });
  };

  downloadTTSAudio = ({ taskId }: DownloadTTSItemOptions): Promise<Blob> => {
    return this.api(`/output/${taskId}.mp3`, {
      method: "GET",
      responseType: "blob",
    });
  };

  downloadTTSSubtitle = ({
    taskId,
  }: DownloadTTSItemOptions): Promise<string> => {
    return this.api(`/output/${taskId}.vtt`, {
      method: "GET",
      responseType: "text",
    });
  };
}
