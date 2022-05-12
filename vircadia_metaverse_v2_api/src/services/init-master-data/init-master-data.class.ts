import config from '../../appconfig';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import { messages } from '../../utils/messages';
import { IsNotNullOrEmpty, readInJSON } from '../../utils/Misc';

export class InitMasterData extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    async find(): Promise<any> {
        const inventoryItemList = (await readInJSON(
            config.metaverseServer.inventoryItemMasterDataFile
        )) as any[];
        if (IsNotNullOrEmpty(inventoryItemList)) {
            for (const inventory of inventoryItemList) {
                const result = await this.app
                    ?.service('inventory-item')
                    ?.create(inventory);

                if (IsNotNullOrEmpty(result.message)) {
                    const inventoryId = inventory.id;
                    delete inventory.id;

                    await this.app
                        ?.service('inventory-item')
                        ?.patch(inventoryId, inventory);
                }
            }
        }

        const questItemList = (await readInJSON(
            config.metaverseServer.questItemMasterDataFile
        )) as any[];
        if (IsNotNullOrEmpty(questItemList)) {
            for (const questItem of questItemList) {
                const result = await this.app
                    ?.service('quest-item')
                    .create(questItem);
                if (IsNotNullOrEmpty(result.message)) {
                    const questItemId = questItem.id;
                    delete questItem.id;
                    await this.app
                        ?.service('quest-item')
                        ?.patch(questItemId, questItem);
                }
            }
        }

        const npcList = (await readInJSON(
            config.metaverseServer.npcMasterDataFile
        )) as any[];

        if (IsNotNullOrEmpty(npcList)) {
            for (const npc of npcList) {
                const result = await this.app?.service('npc').create(npc);
                if (IsNotNullOrEmpty(result.message)) {
                    const npcId = npc.id;
                    delete npc.id;
                    await this.app?.service('npc')?.patch(npcId, npc);
                }
            }
        }
        return Promise.resolve({
            message: messages.common_messages_master_data_init_success,
        });
    }
}

