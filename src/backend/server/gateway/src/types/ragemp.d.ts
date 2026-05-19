/**
 * Minimal RAGE:MP server-side type surface. The gateway only touches a small
 * subset of the API — extend this file as needed instead of pulling a
 * gigantic ambient types package.
 *
 * Full type packages: @ragemp/types-server, @ragempcommunity/types-server.
 * We avoid them here to keep the gateway dep tree lean and explicit about
 * what we depend on.
 */
declare global {
  namespace Mp {
    interface Vector3 { x: number; y: number; z: number; }

    interface Player {
      readonly id: number;
      readonly name: string;
      readonly socialClub: string;
      readonly ip: string;
      readonly hwidHash: string;
      readonly serial: string;
      position: Vector3;
      heading: number;
      dimension: number;
      health: number;
      armour: number;
      kick(reason?: string): void;
      outputChatBox(text: string): void;
      call(eventName: string, args?: unknown[]): void;
    }

    type EventHandler = (...args: unknown[]) => void;
    interface Events {
      add(name: string, handler: EventHandler): void;
      add(handlers: Record<string, EventHandler>): void;
      call(name: string, ...args: unknown[]): void;
    }

    interface Players {
      readonly length: number;
      at(id: number): Player | null;
      forEach(cb: (p: Player) => void): void;
    }
  }

  const mp: {
    events: Mp.Events;
    players: Mp.Players;
    /**
     * GTA-V `Joaat` hash of a model name (e.g. 'mp_m_freemode_01' -> number).
     * Used to set Player.model to the multiplayer freemode skin.
     */
    joaat(name: string): number;
  };
}

export {};
