const Event = pocketnode("event/Event");

/**
 * Server-only events
 */
class ServerEvent extends Event {}

module.exports = ServerEvent;