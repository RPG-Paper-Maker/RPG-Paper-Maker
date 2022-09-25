/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "monstersdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemmonster.h"
#include "lootkind.h"
#include "systemloot.h"
#include "systemmonsteraction.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MonstersDatas::MonstersDatas()
{
    m_model = new QStandardItemModel;
}

MonstersDatas::~MonstersDatas()
{
    SuperListItem::deleteModel(m_model);
}

void MonstersDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_MONSTERS), *this);
}

QStandardItemModel* MonstersDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MonstersDatas::setDefault(QStandardItem* ,
                               QStandardItem* modelItems,
                               QStandardItem* modelWeapons,
                               QStandardItem* modelArmors)
{
    SystemMonster* monster;
    SystemMonsterAction *action;
    QStandardItem* item;
    QList<QStandardItem *> row;
    QStandardItemModel* loots;
    QStandardItemModel* actions;
    SuperListItem* sys = nullptr;
    SystemLoot* loot;
    QString names[] = {RPM::translate(Translations::WOOLY)};
    int classesIds[] = {5};
    int battlersIds[] = {5};
    int facesetsIds[] = {4};
    int experiencesInitial[] = {5};
    int experiencesFinal[] = {5000};
    int experiencesEquation[] = {0};
    QVector<int> currenciesIds[] = {QVector<int>({1})};
    QVector<int> currenciesNb[] = {QVector<int>({1})};
    QVector<LootKind> lootsKind[] = {QVector<LootKind>({LootKind::Item})};
    QVector<int> lootsIds[] = {QVector<int>({1})};
    QVector<int> lootsNb[] =
        {
            QVector<int>({1})
        };
    QVector<int> lootsProba[] =
        {
            QVector<int>({50})
        };
    QVector<int> lootsInit[] =
        {
            QVector<int>({1})
        };
    QVector<int> lootsFinal[] =
        {
            QVector<int>({100})
        };
    SystemProgressionTable *currenciesProgression[] = {
        new SystemProgressionTable(new PrimitiveValue(5), new PrimitiveValue(
            1500), 0)
    };
    int length = (sizeof(names)/sizeof(*names));

    for (int i = 0; i < length; i++) {
        // Loots
        loots = new QStandardItemModel;
        for (int j = 0; j < lootsIds[i].size(); j++){
            switch (lootsKind[i][j]){
            case LootKind::Item:
                sys = SuperListItem::getById(modelItems, currenciesIds[i][j]);
                break;
            case LootKind::Weapon:
                sys = SuperListItem::getById(modelWeapons, currenciesIds[i][j]);
                break;
            case LootKind::Armor:
                sys = SuperListItem::getById(modelArmors, currenciesIds[i][j]);
                break;
            }
            loot = new SystemLoot(sys->id(), sys->name(), lootsKind[i][j],
                new PrimitiveValue(PrimitiveValueKind::DataBase, sys->id()), new
                PrimitiveValue(lootsNb[i][j]), new PrimitiveValue(lootsProba[i]
                [j]), new PrimitiveValue(lootsInit[i][j]), new PrimitiveValue(
                lootsFinal[i][j]));
            row = loot->getModelRow();
            loots->appendRow(row);
        }
        item = new QStandardItem();
        item->setText(SuperListItem::beginningText);
        loots->appendRow(item);

        // Actions
        actions = new QStandardItemModel;

        monster = new SystemMonster(i+1, names[i], classesIds[i], battlersIds[i],
            1, facesetsIds[i], 0, SystemClass::createInheritanceClass(),
            new SystemProgressionTable(new PrimitiveValue(experiencesInitial[i])
            , new PrimitiveValue(experiencesFinal[i]), experiencesEquation[i]),
            loots, actions);
        monster->insertCurrency(i + 1, currenciesProgression[i]);
        action = new SystemMonsterAction(-1, "", MonsterActionKind::UseSkill);
        action->setMonster(monster);
        actions->appendRow(action->getModelRow());
        m_model->appendRow(monster->getModelRow());
    }
}

void MonstersDatas::setDefaultTranslations()
{
    SuperListItem::setModelItemName(m_model, 0, RPM::translate(Translations::WOOLY));
    SuperListItem::setModelItemName(m_model, 1, RPM::translate(Translations::MUSHROOMY));
    SuperListItem::setModelItemName(m_model, 2, RPM::translate(Translations::SLIME_BLUE));
    SuperListItem::setModelItemName(m_model, 3, RPM::translate(Translations::SLIME_BLACK));
    SuperListItem::setModelItemName(m_model, 4, RPM::translate(Translations::SLIME_GOLD));
    SuperListItem::setModelItemName(m_model, 5, RPM::translate(Translations::BAT));
    SuperListItem::setModelItemName(m_model, 6, RPM::translate(Translations::RAT));
    SuperListItem::setModelItemName(m_model, 7, RPM::translate(Translations::ZOMBIE));
    SuperListItem::setModelItemName(m_model, 8, RPM::translate(Translations::GOBLIN));
    SuperListItem::setModelItemName(m_model, 9, RPM::translate(Translations::SKELETON));
    SuperListItem::setModelItemName(m_model, 10, RPM::translate(Translations::SPIDER));
    SuperListItem::setModelItemName(m_model, 11, RPM::translate(Translations::FANTOM));
    SuperListItem::setModelItemName(m_model, 12, RPM::translate(Translations::HARPY));
    SuperListItem::setModelItemName(m_model, 13, RPM::translate(Translations::SQUID));
    SuperListItem::setModelItemName(m_model, 14, RPM::translate(Translations::LAMIA));
    SuperListItem::setModelItemName(m_model, 15, RPM::translate(Translations::KNIGHT));
    SuperListItem::setModelItemName(m_model, 16, RPM::translate(Translations::MIMIC));
    SuperListItem::setModelItemName(m_model, 17, RPM::translate(Translations::OGRE));
    SuperListItem::setModelItemName(m_model, 18, RPM::translate(Translations::DEMON));
    SuperListItem::setModelItemName(m_model, 19, RPM::translate(Translations::ANGEL));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MonstersDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["monsters"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemMonster* sysMonster = new SystemMonster;
        sysMonster->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysMonster)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysMonster->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void MonstersDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemMonster* sysMonster = reinterpret_cast<SystemMonster *>(m_model
            ->item(i)->data().value<quintptr>());
        sysMonster->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["monsters"] = jsonArray;
}
