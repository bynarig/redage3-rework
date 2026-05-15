/**
 * Topic naming follows: <domain>.<kind>.<entity>
 *   kind = events  -> fact happened (past tense, fire-and-forget)
 *   kind = commands -> request an action (imperative, expects reply)
 *   kind = replies  -> response to a command (routed by correlationId)
 *
 * Partition key is always the player UUID (or vehicle id, etc.) so that
 * per-entity ordering is preserved.
 */
export const Topics = {
  // Events (produced by gateway, consumed by services)
  PlayerEvents: 'game.events.player',
  VehicleEvents: 'game.events.vehicle',
  InventoryEvents: 'game.events.inventory',
  EconomyEvents: 'game.events.economy',
  WorldEvents: 'game.events.world',

  // Commands (produced by services or gateway, consumed by target service)
  AuthCommands: 'game.commands.auth',
  PlayerCommands: 'game.commands.player',
  InventoryCommands: 'game.commands.inventory',
  EconomyCommands: 'game.commands.economy',

  // Replies (correlationId-routed responses to commands)
  GatewayReplies: 'game.replies.gateway',
} as const;

export type TopicName = (typeof Topics)[keyof typeof Topics];
