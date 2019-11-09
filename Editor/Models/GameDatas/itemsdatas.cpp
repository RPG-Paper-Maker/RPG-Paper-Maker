/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
        "HP potion", "Super HP potion", "Mega HP potion", "MP potion",
        "Super MP potion", "Mega MP potion", "TP potion", "Super TP potion",
        "Mega TP potion", "Key"
    };
    int iconsID[] = {
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25
    };
    int types[] = {
        1, 1, 1, 1, 1, 1, 1, 1, 1, 2
    };
    bool consumables[] = {
        true, true, true, true, true, true, true, true, true, false
    };
    QString descriptions[] = {
        "A small potion recovering your HP.",
        "A medium potion recovering your HP.",
        "A large potion recovering your HP.",
        "A small potion recovering your MP.",
        "A medium potion recovering your MP.",
        "A large potion recovering your MP.",
        "A small potion recovering your TP.",
        "A medium potion recovering your TP.",
        "A large potion recovering your TP.",
        "A key that can be used for opening a closed door."
    };
    TargetKind targetsKind[] = {
        TargetKind::Ally, TargetKind::Ally, TargetKind::Ally, TargetKind::Ally,
        TargetKind::Ally, TargetKind::Ally, TargetKind::Ally, TargetKind::Ally,
        TargetKind::Ally, TargetKind::None
    };
    QString targetConditionsFormulas[] = {
        "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0",
        "t.hp > 0", "t.hp > 0", "t.hp > 0", ""
    };
    AvailableKind availablesKind[] = {
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Never
    };
    int songsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    int prices[] = {
        10, 100, 500, 20, 200, 600, 20, 200, 600, 0
    };
    QVector<SystemEffect *> effects[] = {
        {SystemEffect::createDamage("-10", QString())}, {SystemEffect
        ::createDamage("-100", QString())}, {SystemEffect::createDamage("-2000",
        QString())}, {SystemEffect::createDamageMP("-10")}, {SystemEffect
        ::createDamageMP("-100")}, {SystemEffect::createDamageMP("-2000")}, {
        SystemEffect::createDamageTP("-10")}, {SystemEffect::createDamageTP(
        "-100")}, {SystemEffect::createDamageTP("-2000")}, {}
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        modelEffects = new QStandardItemModel;
        for (j = 0, l = effects[i].length(); j < l; j++) {
            modelEffects->appendRow(effects[i][j]->getModelRow());
        }
        modelEffects->appendRow(new QStandardItem);
        sys = new SystemItem(i + 1, new LangsTranslation(names[i]), iconsID[i],
            types[i], consumables[i], new LangsTranslation(descriptions[i]),
            targetsKind[i], new PrimitiveValue(targetConditionsFormulas[i]),
            availablesKind[i], new SystemPlaySong(songsID[i], SongKind::Sound),
            new PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(prices[i]),
            modelEffects);
        m_model->appendRow(sys->getModelRow());
    }
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
