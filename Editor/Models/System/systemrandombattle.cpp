/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemrandombattle.h"
#include "dialogsystemrandombattle.h"
#include "systemnumber.h"
#include "rpm.h"

const QString SystemRandomBattle::JSON_TROOP_ID = "troopID";
const QString SystemRandomBattle::JSON_PRIORITY = "priority";
const QString SystemRandomBattle::JSON_IS_ENTIRE_MAP = "isEntireMap";
const QString SystemRandomBattle::JSON_TERRAINS = "terrains";
const int SystemRandomBattle::DEFAULT_PRIORITY = 10;
const bool SystemRandomBattle::DEFAULT_IS_ENTIRE_MAP = true;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemRandomBattle::SystemRandomBattle() :
    SystemRandomBattle(-1, "")
{

}

SystemRandomBattle::SystemRandomBattle(int i, QString name, PrimitiveValue
    *troopID, PrimitiveValue *priority, bool isEntireMap, QStandardItemModel
    *terrains) :
    SuperListItem(i, name),
    m_troopID(troopID),
    m_priority(priority),
    m_isEntireMap(isEntireMap),
    m_terrains(terrains),
    m_mapProperties(nullptr),
    m_editing(false)
{
    m_troopID->setModelDataBase(RPM::get()->project()->gameDatas()->troopsDatas()
        ->model());
    this->setMapProperties(RPM::get()->project()->currentMapProperties());
}

SystemRandomBattle::~SystemRandomBattle()
{
    delete m_troopID;
    delete m_priority;
    SuperListItem::deleteModel(m_terrains);
}

PrimitiveValue * SystemRandomBattle::troopID() const
{
    return m_troopID;
}

PrimitiveValue * SystemRandomBattle::priority() const
{
    return m_priority;
}

bool SystemRandomBattle::isEntireMap() const
{
    return m_isEntireMap;
}

void SystemRandomBattle::setIsEntireMap(bool isEntireMap)
{
    m_isEntireMap = isEntireMap;
}

QStandardItemModel * SystemRandomBattle::terrains() const
{
    return m_terrains;
}

MapProperties * SystemRandomBattle::mapProperties() const
{
    return m_mapProperties;
}

void SystemRandomBattle::setMapProperties(MapProperties *mapProperties)
{
    m_mapProperties = mapProperties;
}

bool SystemRandomBattle::editing() const
{
    return m_editing;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

double SystemRandomBattle::calculateProbability(int p) const
{
    if (m_mapProperties == nullptr) {
        return -1;
    }
    double sum = 0;
    SystemRandomBattle *randomBattle;
    for (int i = 0, l = m_mapProperties->randomBattles()->invisibleRootItem()
         ->rowCount(); i < l; i++)
    {
        randomBattle = reinterpret_cast<SystemRandomBattle *>(SuperListItem
            ::getItemModelAt(m_mapProperties->randomBattles(), i));
        if (randomBattle != nullptr)
        {
            if (randomBattle->priority()->kind() == PrimitiveValueKind::Number)
            {
                if (!randomBattle->editing())
                {
                    sum += randomBattle->priority()->numberValue();
                }
            } else
            {
                return -1;
            }
        }
    }
    sum += (p < 0 ? 0 : p);
    return sum == 0.0 ? 0 : (m_priority->numberValue() / sum) * 100.0;
}

// -------------------------------------------------------

QString SystemRandomBattle::probabilityToString(int p) const
{
    double proba = this->calculateProbability(p);
    return proba < 0 ? "?" : QString::number(proba);
}

// -------------------------------------------------------

QString SystemRandomBattle::terrainToString() const
{
    if (m_isEntireMap)
    {
        return RPM::DASH;
    }
    SystemNumber *terrain;
    QStringList list;
    for (int i = 0, l = m_terrains->invisibleRootItem()->rowCount(); i < l; i++)
    {
        terrain = reinterpret_cast<SystemNumber *>(SuperListItem::getItemModelAt(
            m_terrains, i));
        if (terrain != nullptr)
        {
            list << terrain->value()->toString();
        }
    }
    return list.join(RPM::COMMA);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemRandomBattle::openDialog()
{
    SystemRandomBattle randomBattle;
    MapProperties *mapProperties = randomBattle.mapProperties();
    randomBattle.setCopy(*this);
    randomBattle.setMapProperties(mapProperties);
    m_editing = true;
    DialogSystemRandomBattle dialog(randomBattle);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(randomBattle);
        m_editing = false;
        return true;
    }
    m_editing = false;
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemRandomBattle::createCopy() const
{
    SystemRandomBattle *super = new SystemRandomBattle;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemRandomBattle::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemRandomBattle *randomBattle = reinterpret_cast<const
        SystemRandomBattle *>(&super);
    m_troopID->setCopy(*randomBattle->m_troopID);
    m_priority->setCopy(*randomBattle->m_priority);
    m_isEntireMap = randomBattle->m_isEntireMap;
    SuperListItem::deleteModel(m_terrains, false);
    SuperListItem::copy(m_terrains, randomBattle->m_terrains);
    m_mapProperties = randomBattle->m_mapProperties;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemRandomBattle::getModelRow() const
{
    QList<QStandardItem *> row;
    QStandardItem *itemTroop;
    QStandardItem *itemTerrain;
    QStandardItem *itemPriority;
    QStandardItem *itemProbability;
    row = QList<QStandardItem *>();
    itemTroop = new QStandardItem;
    itemTerrain = new QStandardItem;
    itemPriority = new QStandardItem;
    itemProbability = new QStandardItem;
    itemTroop->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemTroop->setText(m_troopID->toString());
    itemTroop->setFlags(itemTroop->flags() ^ (Qt::ItemIsDropEnabled));
    itemTerrain->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemTerrain->setText(this->terrainToString());
    itemTerrain->setFlags(itemTerrain->flags() ^ (Qt::ItemIsDropEnabled));
    itemPriority->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemPriority->setText(m_priority->toString());
    itemPriority->setFlags(itemPriority->flags() ^ (Qt::ItemIsDropEnabled));
    itemProbability->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemProbability->setText(this->probabilityToString());
    itemProbability->setFlags(itemProbability->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(itemTroop);
    row.append(itemTerrain);
    row.append(itemPriority);
    row.append(itemProbability);
    return row;
}

// -------------------------------------------------------

void SystemRandomBattle::read(const QJsonObject &json)
{
    SuperListItem::read(json);

    SuperListItem::deleteModel(m_terrains, false);
    if (json.contains(JSON_TROOP_ID))
    {
        m_troopID->read(json[JSON_TROOP_ID].toObject());
    }
    if (json.contains(JSON_PRIORITY))
    {
        m_priority->read(json[JSON_PRIORITY].toObject());
    }
    if (json.contains(JSON_IS_ENTIRE_MAP))
    {
        m_isEntireMap = json[JSON_IS_ENTIRE_MAP].toBool();
    }
    SuperListItem::readTree(m_terrains, new SystemNumber, json, JSON_TERRAINS);
    m_mapProperties = RPM::get()->project()->currentMapProperties();
}

// -------------------------------------------------------

void SystemRandomBattle::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    QJsonObject obj;
    if (!m_troopID->isDefaultDataBaseValue())
    {
        obj = QJsonObject();
        m_troopID->write(obj);
        json[JSON_TROOP_ID] = obj;
    }
    if (m_priority->kind() != PrimitiveValueKind::Number || m_priority
        ->numberValue() != DEFAULT_PRIORITY)
    {
        obj = QJsonObject();
        m_priority->write(obj);
        json[JSON_PRIORITY] = obj;
    }
    if (m_isEntireMap != DEFAULT_IS_ENTIRE_MAP)
    {
        json[JSON_IS_ENTIRE_MAP] = m_isEntireMap;
        SuperListItem::writeTree(m_terrains, json, JSON_TERRAINS);
    }
}
