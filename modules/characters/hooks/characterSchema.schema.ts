import { z } from 'zod';

export const characterSchema = z.object({
  imie: z.string().nullable(),
  przynaleznosc: z.array(z.string().nullable()),
  wystepowanie: z.array(z.string().nullable()),
  bron: z.array(z.string().nullable()),
  zbroja: z.array(z.string().nullable()),
  zdjecie: z.string().nullable(),
});

export const characterArraySchema = z.array(characterSchema);