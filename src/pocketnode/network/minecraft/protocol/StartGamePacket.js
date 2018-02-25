const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class StartGamePacket extends DataPacket {
    static getId(){
        return MinecraftInfo.START_GAME_PACKET;
    }

    initVars(){
        this.entityUniqueId = 0;
        this.entityRuntimeId = 0;
        this.playerGamemode = 0;

        this.playerPosition = null;

        this.pitch = 0.0;
        this.yaw = 0.0;

        this.seed = 0;
        this.dimension = 0;
        this.generator = 1; //default infinite - 0 old, 1 infinite, 2 flat
        this.levelGamemode = 0;
        this.difficulty = 0;
        this.spawnX = 0;
        this.spawnY = 0;
        this.spawnZ = 0;
        this.hasAchievementsDisabled = true;
        this.time = -1;
        this.eduMode = false;

        this.rainLevel = 0.0;
        this.lightningLevel = 0.0;
        this.isMultiplayerGame = true;
        this.hasLANBroadcast = true;
        this.hasXboxLiveBroadcast = false;
        this.commandsEnabled = true;
        this.isTexturePacksRequired = true;

        this.gameRules = []; //TODO: implement this
        this.hasBonusChestEnabled = false;
        this.hasStartWithMapEnabled = false;
        this.hasTrustPlayersEnabled = false;
        this.defaultPlayerPermission = 2;//PlayerPermissions::MEMBER; //TODO
        this.xboxLiveBroadcastMode = 0; //TODO: find values
        this.serverChunkTickRadius = 4;

        this.levelId = ""; //base64 string, usually the same as world folder name in vanilla

        this.levelName = "";

        this.premiumWorldTemplateId = "";
        this.unknownBool = false;
        this.currentTick = 0;
        this.enchantmentSeed = 0;
    }

    constructor(){
        super();
        this.initVars();
    }

    _decodePayload(){
        this.entityUniqueId = this.getEntityUniqueId();
        this.entityRuntimeId = this.getEntityRuntimeId();
        this.playerGamemode = this.readVarInt();

        this.playerPosition = this.getVector3Obj();

        this.pitch = this.readLFloat();
        this.yaw = this.readLFloat();

        //Level settings
        this.seed = this.readVarInt();
        this.dimension = this.readVarInt();
        this.generator = this.readVarInt();
        this.levelGamemode = this.readVarInt();
        this.difficulty = this.readVarInt();
        [this.spawnX, this.spawnY, this.spawnZ] = this.getBlockPosition();
        this.hasAchievementsDisabled = this.readBool();
        this.time = this.readVarInt();
        this.eduMode = this.readBool();
        this.rainLevel = this.readLFloat();
        this.lightningLevel = this.readLFloat();
        this.isMultiplayerGame = this.readBool();
        this.hasLANBroadcast = this.readBool();
        this.hasXboxLiveBroadcast = this.readBool();
        this.commandsEnabled = this.readBool();
        this.isTexturePacksRequired = this.readBool();
        this.gameRules = this.getGameRules();
        this.hasBonusChestEnabled = this.readBool();
        this.hasStartWithMapEnabled = this.readBool();
        this.hasTrustPlayersEnabled = this.readBool();
        this.defaultPlayerPermission = this.readVarInt();
        this.xboxLiveBroadcastMode = this.readVarInt();
        this.serverChunkTickRadius = this.readLInt();

        this.levelId = this.readString();
        this.levelName = this.readString();
        this.premiumWorldTemplateId = this.readString();
        this.unknownBool = this.readBool();
        this.currentTick = this.readLLong();

        this.enchantmentSeed = this.readVarInt();
    }

    _encodePayload(){
        this.writeEntityUniqueId(this.entityUniqueId);
        this.writeEntityRuntimeId(this.entityRuntimeId);
        this.writeVarInt(this.playerGamemode);

        this.writeVector3Obj(this.playerPosition);

        this.writeLFloat(this.pitch)
            .writeLFloat(this.yaw);

        this.writeVarInt(this.seed)
            .writeVarInt(this.dimension)
            .writeVarInt(this.generator)
            .writeVarInt(this.levelGamemode)
            .writeVarInt(this.difficulty)
            .writeBlockPosition(this.spawnX, this.spawnY, this.spawnZ)
            .writeBool(this.hasAchievementsDisabled)
            .writeVarInt(this.time)
            .writeBool(this.eduMode)
            .writeLFloat(this.rainLevel)
            .writeLFloat(this.lightningLevel)
            .writeBool(this.isMultiplayerGame)
            .writeBool(this.hasLANBroadcast)
            .writeBool(this.hasXboxLiveBroadcast)
            .writeBool(this.commandsEnabled)
            .writeBool(this.isTexturePacksRequired)
            .writeGameRules(this.gameRules)
            .writeBool(this.hasBonusChestEnabled)
            .writeBool(this.hasStartWithMapEnabled)
            .writeBool(this.hasTrustPlayersEnabled)
            .writeVarInt(this.defaultPlayerPermission)
            .writeVarInt(this.xboxLiveBroadcastMode)
            .writeLInt(this.serverChunkTickRadius);

        this.writeString(this.levelId)
            .writeString(this.levelName)
            .writeString(this.premiumWorldTemplateId)
            .writeBool(this.unknownBool)
            .writeLLong(this.currentTick);

        this.writeVarInt(this.enchantmentSeed);
    }
}

module.exports = StartGamePacket;