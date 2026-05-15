/**
 * Topic naming follows: <domain>.<kind>.<entity>
 *   kind = events  -> fact happened (past tense, fire-and-forget)
 *   kind = commands -> request an action (imperative, expects reply)
 *   kind = replies  -> response to a command (routed by correlationId)
 *
 * Partition key is always the player UUID (or vehicle id, etc.) so that
 * per-entity ordering is preserved.
 */
export declare const Topics: {
    readonly PlayerEvents: "game.events.player";
    readonly VehicleEvents: "game.events.vehicle";
    readonly InventoryEvents: "game.events.inventory";
    readonly EconomyEvents: "game.events.economy";
    readonly WorldEvents: "game.events.world";
    readonly AuthCommands: "game.commands.auth";
    readonly PlayerCommands: "game.commands.player";
    readonly InventoryCommands: "game.commands.inventory";
    readonly EconomyCommands: "game.commands.economy";
    readonly GatewayReplies: "game.replies.gateway";
};
export type TopicName = (typeof Topics)[keyof typeof Topics];
//# sourceMappingURL=topics.d.ts.map