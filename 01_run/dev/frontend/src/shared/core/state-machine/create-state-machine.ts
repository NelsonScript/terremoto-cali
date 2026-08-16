/**
 * Máquina de estados genérica, sin dependencias externas, pensada para vivir
 * en la capa de aplicación de un feature (junto al slice de Redux) y
 * simplificar la lógica de transición de estados de un caso de uso
 * (ej.: idle → validando → enviando → éxito | error).
 *
 * No reemplaza a Redux: el slice sigue siendo la fuente de verdad del
 * estado en el store. La máquina se usa para *validar* y *resolver* la
 * transición antes de despachar la acción correspondiente, evitando que
 * ese if/else viva desperdigado en componentes o en el propio slice.
 *
 * Ver ARCHITECTURE_RULES.md § Máquina de estados.
 */

export interface StateMachineConfig<TState extends string, TEvent extends string> {
  initial: TState;
  /**
   * Tabla de transición: para cada estado, qué eventos son válidos y a qué
   * estado llevan. Un evento no listado para el estado actual es ignorado
   * (la máquina permanece en el mismo estado) — así los componentes no
   * necesitan saber qué transiciones son legales en cada momento.
   */
  transitions: Record<TState, Partial<Record<TEvent, TState>>>;
}

export interface StateMachine<TState extends string, TEvent extends string> {
  readonly current: TState;
  /** Devuelve el siguiente estado sin mutar nada (uso desde selectors/reducers puros). */
  peek(event: TEvent): TState;
  /** Devuelve una nueva instancia de la máquina ya transicionada. */
  send(event: TEvent): StateMachine<TState, TEvent>;
  can(event: TEvent): boolean;
}

export function createStateMachine<TState extends string, TEvent extends string>(
  config: StateMachineConfig<TState, TEvent>,
  current: TState = config.initial
): StateMachine<TState, TEvent> {
  const peek = (event: TEvent): TState => {
    const next = config.transitions[current]?.[event];
    return next ?? current;
  };

  return {
    current,
    peek,
    can: (event: TEvent) => config.transitions[current]?.[event] !== undefined,
    send: (event: TEvent) => createStateMachine(config, peek(event)),
  };
}
