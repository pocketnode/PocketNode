const TerminalTextFormat = {};
TerminalTextFormat.ESCAPE        = "\u001b";
TerminalTextFormat.BLACK         = TerminalTextFormat.ESCAPE + "[30m";
TerminalTextFormat.DARK_BLUE     = TerminalTextFormat.ESCAPE + "[34m";
TerminalTextFormat.DARK_GREEN    = TerminalTextFormat.ESCAPE + "[32m";
TerminalTextFormat.DARK_AQUA     = TerminalTextFormat.ESCAPE + "[36m";
TerminalTextFormat.DARK_RED      = TerminalTextFormat.ESCAPE + "[31m";
TerminalTextFormat.DARK_PURPLE   = TerminalTextFormat.ESCAPE + "[35m";
TerminalTextFormat.GOLD          = TerminalTextFormat.ESCAPE + "[33m";
TerminalTextFormat.GRAY          = TerminalTextFormat.ESCAPE + "[37m";
TerminalTextFormat.DARK_GRAY     = TerminalTextFormat.ESCAPE + "[30;1m";
TerminalTextFormat.BLUE          = TerminalTextFormat.ESCAPE + "[34;1m";
TerminalTextFormat.GREEN         = TerminalTextFormat.ESCAPE + "[32;1m";
TerminalTextFormat.AQUA          = TerminalTextFormat.ESCAPE + "[36;1m";
TerminalTextFormat.RED           = TerminalTextFormat.ESCAPE + "[31;1m";
TerminalTextFormat.LIGHT_PURPLE  = TerminalTextFormat.ESCAPE + "[35;1m";
TerminalTextFormat.YELLOW        = TerminalTextFormat.ESCAPE + "[33;1m";
TerminalTextFormat.WHITE         = TerminalTextFormat.ESCAPE + "[37;1m";

TerminalTextFormat.OBFUSCATED    = TerminalTextFormat.ESCAPE + "[47m";
TerminalTextFormat.BOLD          = TerminalTextFormat.ESCAPE + "[1m";
TerminalTextFormat.STRIKETHROUGH = TerminalTextFormat.ESCAPE + "[9m";
TerminalTextFormat.UNDERLINE     = TerminalTextFormat.ESCAPE + "[4m";
TerminalTextFormat.ITALIC        = TerminalTextFormat.ESCAPE + "[3m";
TerminalTextFormat.RESET         = TerminalTextFormat.ESCAPE + "[0m";

module.exports = TerminalTextFormat;