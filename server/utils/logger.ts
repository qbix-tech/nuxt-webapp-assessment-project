import { createConsola } from "consola";

let _consolaInstance: ReturnType<typeof createConsola> | null = null;

export const useLogger = () => {
  if (!_consolaInstance) {
    _consolaInstance = createConsola({
      level: process.env.NODE_ENV === "production" ? 3 : 4,
      fancy: true,
      formatOptions: {
        date: true,
      },
    }).withTag("server");
  }
  return _consolaInstance;
};
