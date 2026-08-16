import type { GoogleGenAI } from '@google/genai';
import type { IFuenteNoticiasClipping, ParametrosBusquedaClipping } from '../../application/ports/fuente-noticias-clipping.port';
import type { DepartamentoCubierto } from '../../config/departamentos';
import { construirPromptClipping } from './prompt-clipping.builder';

function extraerJSON(texto: string): unknown {
  const limpio = texto
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(limpio);
  } catch (e) {
    const inicio = limpio.indexOf('[');
    const fin = limpio.lastIndexOf(']');
    if (inicio !== -1 && fin !== -1 && fin > inicio) {
      return JSON.parse(limpio.slice(inicio, fin + 1));
    }
    throw new Error(`No se pudo parsear la respuesta de Gemini como JSON: ${(e as Error).message}`);
  }
}

/**
 * Implementación concreta del puerto `IFuenteNoticiasClipping` usando
 * Gemini vía Vertex AI, con Grounding con Google Search. Mismo modelo,
 * mismo prompt y misma configuración (`temperature: 0.2`) que el script
 * original.
 */
export class GeminiFuenteNoticiasClipping implements IFuenteNoticiasClipping {
  constructor(
    private readonly genAI: GoogleGenAI,
    private readonly modelo: string,
    private readonly departamentos: readonly DepartamentoCubierto[],
  ) {}

  async buscarCandidatas(params: ParametrosBusquedaClipping): Promise<unknown[]> {
    const prompt = construirPromptClipping({ ...params, departamentos: this.departamentos });

    const response = await this.genAI.models.generateContent({
      model: this.modelo,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const texto = response.text || '';
    const crudo = extraerJSON(texto);

    if (!Array.isArray(crudo)) {
      throw new Error('La respuesta de Gemini no fue un array JSON.');
    }

    return crudo;
  }
}
