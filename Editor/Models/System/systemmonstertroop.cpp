/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemmonstertroop.h"
#include "rpm.h"
#include "dialogsystemmonstertroop.h"

const QString SystemMonsterTroop::JSON_LEVEL = "l";
const QString SystemMonsterTroop::JSON_HIDDEN = "h";
const QString SystemMonsterTroop::JSON_IS_SPECIFIC_POSITION = "isSpecificPosition";
const QString SystemMonsterTroop::JSON_SPECIFIC_POSITION = "specificPosition";
const bool SystemMonsterTroop::DEFAULT_HIDDEN = false;
const bool SystemMonsterTroop::DEFAULT_IS_SPECIFIC_POSITION = false;
const QString SystemMonsterTroop::DEFAULT_SPECIFIC_POSITION = "new Core.Vector3(0,0,0)";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonsterTroop::SystemMonsterTroop(int i, QString n, PrimitiveValue *level,
    PrimitiveValue *hidden, bool isSpecificPosition, PrimitiveValue
    *specificPosition) :
    SuperListItem(i,n),
    m_level(level),
    m_hidden(hidden),
    m_isSpecificPosition(isSpecificPosition),
    m_specificPosition(specificPosition)
{

}

SystemMonsterTroop::~SystemMonsterTroop()
{
    delete m_specificPosition;
    delete m_level;
    delete m_hidden;
}

PrimitiveValue * SystemMonsterTroop::level() const
{
    return m_level;
}

PrimitiveValue * SystemMonsterTroop::hidden() const
{
    return m_hidden;
}

bool SystemMonsterTroop::isSpecificPosition() const
{
    return m_isSpecificPosition;
}

void SystemMonsterTroop::setIsSpecificPosition(bool isSpecificPosition)
{
    m_isSpecificPosition = isSpecificPosition;
}

PrimitiveValue * SystemMonsterTroop::specificPosition() const
{
    return m_specificPosition;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemMonsterTroop::updateName()
{
    p_name = SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->monstersDatas()->model()->invisibleRootItem(), p_id)->name();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemMonsterTroop::toString() const
{
    return SuperListItem::toString() + " (lv." + m_level->toString() + ")";
}

// -------------------------------------------------------

bool SystemMonsterTroop::openDialog()
{
    SystemMonsterTroop monsterTroop;
    monsterTroop.setCopy(*this);
    DialogSystemMonsterTroop dialog(monsterTroop);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(monsterTroop);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemMonsterTroop::createCopy() const
{
    SystemMonsterTroop *super = new SystemMonsterTroop;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMonsterTroop::setCopy(const SuperListItem &super)
{
    const SystemMonsterTroop *monsterTroop = reinterpret_cast<const
        SystemMonsterTroop *>(&super);
    p_id = monsterTroop->p_id;
    this->updateName();
    m_level->setCopy(*monsterTroop->m_level);
    m_hidden->setCopy(*monsterTroop->m_hidden);
    m_isSpecificPosition = monsterTroop->m_isSpecificPosition;
    m_specificPosition->setCopy(*monsterTroop->m_specificPosition);
}

// -------------------------------------------------------

void SystemMonsterTroop::read(const QJsonObject &json)
{
    p_id = json[SuperListItem::JSON_ID].toInt();
    this->updateName();
    if (json.contains(JSON_LEVEL))
    {
        m_level->read(json[JSON_LEVEL].toObject());
    }
    if (json.contains(JSON_HIDDEN))
    {
        m_hidden->read(json[JSON_HIDDEN].toObject());
    }
    if (json.contains(JSON_IS_SPECIFIC_POSITION))
    {
        m_isSpecificPosition = json[JSON_IS_SPECIFIC_POSITION].toBool();
    }
    if (json.contains(JSON_SPECIFIC_POSITION))
    {
        m_specificPosition->read(json[JSON_SPECIFIC_POSITION].toObject());
    }
}

// -------------------------------------------------------

void SystemMonsterTroop::write(QJsonObject &json) const
{
    json[SuperListItem::JSON_ID] = p_id;
    QJsonObject obj;
    if (m_level->kind() != PrimitiveValueKind::Number || m_level->numberValue() != 1)
    {
        obj = QJsonObject();
        m_level->write(obj);
        json[JSON_LEVEL] = obj;
    }
    if (m_hidden->kind() != PrimitiveValueKind::Switch || m_hidden->switchValue() != DEFAULT_HIDDEN)
    {
        obj = QJsonObject();
        m_hidden->write(obj);
        json[JSON_HIDDEN] = obj;
    }
    if (m_isSpecificPosition != DEFAULT_IS_SPECIFIC_POSITION)
    {
        json[JSON_IS_SPECIFIC_POSITION] = m_isSpecificPosition;
    }
    if (m_specificPosition->kind() != PrimitiveValueKind::Message ||
        m_specificPosition->messageValue() != DEFAULT_SPECIFIC_POSITION)
    {
        obj = QJsonObject();
        m_specificPosition->write(obj);
        json[JSON_SPECIFIC_POSITION] = obj;
    }
}
