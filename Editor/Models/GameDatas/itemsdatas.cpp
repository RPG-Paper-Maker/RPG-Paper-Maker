/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "itemsdatas.h"
#include "systemitem.h"
#include "rpm.h"
#include "common.h"
#include "systemeffect.h"
#include "systemcost.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ItemsDatas::ItemsDatas()
{
    m_model = new QStandardItemModel;
}

ItemsDatas::~ItemsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void ItemsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_ITEMS), *this);
}

QStandardItemModel* ItemsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ItemsDatas::setDefault() {
    int i, j, length, l;
    QStandardItemModel *modelEffects;
    SystemItem *sys;

    QString names[] = {
        RPM::translate(Translations::HP_POTION),
        RPM::translate(Translations::SUPER_HP_POTION),
        RPM::translate(Translations::MEGA_HP_POTION),
        RPM::translate(Translations::MP_POTION),
        RPM::translate(Translations::SUPER_MP_POTION),
        RPM::translate(Translations::MEGA_MP_POTION),
        RPM::translate(Translations::TP_POTION),
        RPM::translate(Translations::SUPER_TP_POTION),
        RPM::translate(Translations::MEGA_TP_POTION),
        RPM::translate(Translations::PHOENIX_FEATHER),
        RPM::translate(Translations::KEY)
    };
    int iconsX[] = {
        10, 11, 12, 13, 14, 15, 0, 1, 2, 0, 9
    };
    int iconsY[] = {
        1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 1
    };
    int types[] = {
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2
    };
    bool consumables[] = {
        true, true, true, true, true, true, true, true, true, true, false
    };
    QString descriptions[] = {
        RPM::translate(Translations::HP_POTION_DESCRIPTION),
        RPM::translate(Translations::SUPER_HP_POTION_DESCRIPTION),
        RPM::translate(Translations::MEGA_HP_POTION_DESCRIPTION),
        RPM::translate(Translations::MP_POTION_DESCRIPTION),
        RPM::translate(Translations::SUPER_MP_POTION_DESCRIPTION),
        RPM::translate(Translations::MEGA_MP_POTION_DESCRIPTION),
        RPM::translate(Translations::TP_POTION_DESCRIPTION),
        RPM::translate(Translations::SUPER_TP_POTION_DESCRIPTION),
        RPM::translate(Translations::MEGA_TP_POTION_DESCRIPTION),
        RPM::translate(Translations::PHOENIX_FEATHER_DESCRIPTION),
        RPM::translate(Translations::KEY)
    };
    TargetKind targetsKind[] = {
        TargetKind::Ally, TargetKind::Ally, TargetKind::Ally, TargetKind::Ally,
        TargetKind::Ally, TargetKind::Ally, TargetKind::Ally, TargetKind::Ally,
        TargetKind::Ally, TargetKind::Ally, TargetKind::None
    };
    QString targetConditionsFormulas[] = {
        "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0",
        "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp === 0", ""
    };
    AvailableKind availablesKind[] = {
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Never
    };
    int songsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    int prices[] = {
        10, 100, 500, 20, 200, 600, 20, 200, 600, 1000, 0
    };
    QVector<SystemEffect *> effects[] = {
        {SystemEffect::createDamage("-10", QString())}, {SystemEffect
        ::createDamage("-100", QString())}, {SystemEffect::createDamage("-2000",
        QString())}, {SystemEffect::createDamageMP("-10")}, {SystemEffect
        ::createDamageMP("-100")}, {SystemEffect::createDamageMP("-2000")}, {
        SystemEffect::createDamageTP("-10")}, {SystemEffect::createDamageTP(
        "-100")}, {SystemEffect::createDamageTP("-2000")}, {SystemEffect
        ::createDamage("-1", QString())}, {}
    };
    length = (sizeof(names)/sizeof(*names));
    QStandardItemModel *modelPrice;
    for (i = 0; i < length; i++) {
        modelEffects = new QStandardItemModel;
        modelPrice = new QStandardItemModel;
        for (j = 0, l = effects[i].length(); j < l; j++) {
            modelEffects->appendRow(effects[i][j]->getModelRow());
        }
        modelEffects->appendRow(new QStandardItem);
        modelPrice->appendRow((new SystemCost(DamagesKind::Currency, new
            PrimitiveValue(PrimitiveValueKind::DataBase, 1), new PrimitiveValue(
            PrimitiveValueKind::DataBase, 1), 1, new PrimitiveValue(QString
            ::number(prices[i]))))->getModelRow());
        sys = new SystemItem(i + 1, names[i], 1, iconsX[i], iconsY[i], types[i],
            consumables[i], new SystemTranslatable(-1, descriptions[i]), targetsKind[i],
            targetConditionsFormulas[i].isEmpty() ? new PrimitiveValue(
            PrimitiveValueKind::None) : new PrimitiveValue(targetConditionsFormulas[i]),
            availablesKind[i], new SystemPlaySong(songsID[i], SongKind::Sound),
            new PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(true), new
            SystemTranslatable(1, SystemItem::DEFAULT_BATTLE_MESSAGE), modelPrice,
            modelEffects);
        m_model->appendRow(sys->getModelRow());
    }
}

void ItemsDatas::setDefaultTranslations()
{
    SystemCommonSkillItem::setNameDescription(m_model, 0, RPM::translate(Translations::HP_POTION), RPM::translate(Translations::HP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 1, RPM::translate(Translations::SUPER_HP_POTION), RPM::translate(Translations::SUPER_HP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 2, RPM::translate(Translations::MEGA_HP_POTION), RPM::translate(Translations::MEGA_HP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 3, RPM::translate(Translations::MP_POTION), RPM::translate(Translations::MP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 4, RPM::translate(Translations::SUPER_MP_POTION), RPM::translate(Translations::SUPER_MP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 5, RPM::translate(Translations::MEGA_MP_POTION), RPM::translate(Translations::MEGA_MP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 6, RPM::translate(Translations::TP_POTION), RPM::translate(Translations::TP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 7, RPM::translate(Translations::SUPER_TP_POTION), RPM::translate(Translations::SUPER_TP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 8, RPM::translate(Translations::MEGA_TP_POTION), RPM::translate(Translations::MEGA_TP_POTION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 9, RPM::translate(Translations::PHOENIX_FEATHER), RPM::translate(Translations::PHOENIX_FEATHER_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 10, RPM::translate(Translations::REMEDY), RPM::translate(Translations::REMEDY_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 11, RPM::translate(Translations::REMEDY_POISONED), RPM::translate(Translations::REMEDY_POISONED_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 12, RPM::translate(Translations::REMEDY_BURNT), RPM::translate(Translations::REMEDY_BURNT_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 13, RPM::translate(Translations::REMEDY_PARALIZED), RPM::translate(Translations::REMEDY_PARALIZED_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 14, RPM::translate(Translations::REMEDY_CONFUSED), RPM::translate(Translations::REMEDY_CONFUSED_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 15, RPM::translate(Translations::REMEDY_MUTED), RPM::translate(Translations::REMEDY_MUTED_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 16, RPM::translate(Translations::REMEDY_SLEEPING), RPM::translate(Translations::REMEDY_SLEEPING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 17, RPM::translate(Translations::REMEDY_BLIND), RPM::translate(Translations::REMEDY_BLIND_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 18, RPM::translate(Translations::KEY), RPM::translate(Translations::KEY_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 19, RPM::translate(Translations::BIG_KEY), RPM::translate(Translations::BIG_KEY_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 20, RPM::translate(Translations::MAP), RPM::translate(Translations::MAP_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 21, RPM::translate(Translations::PLUSH), RPM::translate(Translations::PLUSH_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 22, RPM::translate(Translations::ENVELOPE), RPM::translate(Translations::ENVELOPE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 23, RPM::translate(Translations::PAGE), RPM::translate(Translations::PAGE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 24, RPM::translate(Translations::BOOK), RPM::translate(Translations::BOOK_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 25, RPM::translate(Translations::BAG), RPM::translate(Translations::BAG_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 26, RPM::translate(Translations::PICKAXE), RPM::translate(Translations::PICKAXE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 27, RPM::translate(Translations::SHOVEL), RPM::translate(Translations::SHOVEL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 28, RPM::translate(Translations::STRING), RPM::translate(Translations::STRING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 29, RPM::translate(Translations::CRYSTAL), RPM::translate(Translations::CRYSTAL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 30, RPM::translate(Translations::PEARL), RPM::translate(Translations::PEARL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 31, RPM::translate(Translations::SAPPHIRE), RPM::translate(Translations::SAPPHIRE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 32, RPM::translate(Translations::RUBY), RPM::translate(Translations::RUBY_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 33, RPM::translate(Translations::EMERALD), RPM::translate(Translations::EMERALD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 34, RPM::translate(Translations::ROOT_RED), RPM::translate(Translations::ROOT_RED_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 35, RPM::translate(Translations::ROOT_BLUE), RPM::translate(Translations::ROOT_BLUE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 36, RPM::translate(Translations::ROOT_GREEN), RPM::translate(Translations::ROOT_GREEN_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 37, RPM::translate(Translations::ROOT_BROWN), RPM::translate(Translations::ROOT_BROWN_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 38, RPM::translate(Translations::ROOT_PURPLE), RPM::translate(Translations::ROOT_PURPLE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 39, RPM::translate(Translations::ROOT_YELLOW), RPM::translate(Translations::ROOT_YELLOW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 40, RPM::translate(Translations::ROOT_PINK), RPM::translate(Translations::ROOT_PINK_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 41, RPM::translate(Translations::ROOT_CYAN), RPM::translate(Translations::ROOT_CYAN_DESCRIPTION));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ItemsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["items"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemItem* sysItem = new SystemItem;
        sysItem->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sysItem)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysItem->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ItemsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemItem* sysItem = ((SystemItem*)m_model->item(i)->data()
                               .value<quintptr>());
        sysItem->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["items"] = jsonArray;
}
