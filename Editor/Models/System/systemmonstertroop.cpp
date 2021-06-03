/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
const QString SystemMonsterTroop::JSON_IS_SPECIFIC_POSITION = "isSpecificPosition";
const QString SystemMonsterTroop::JSON_SPECIFIC_POSITION = "specificPosition";
const bool SystemMonsterTroop::DEFAULT_IS_SPECIFIC_POSITION = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonsterTroop::SystemMonsterTroop(int i, QString n, int level, bool
    isSpecificPosition, PrimitiveValue *specificPosition) :
    SuperListItem(i,n),
    m_level(level),
    m_isSpecificPosition(isSpecificPosition),
    m_specificPosition(specificPosition)
{

}

SystemMonsterTroop::~SystemMonsterTroop()
{
    delete m_specificPosition;
}

int SystemMonsterTroop::level() const
{
    return m_level;
}

void SystemMonsterTroop::setLevel(int l)
{
    m_level = l;
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
    return SuperListItem::toString() + " (lv." + QString::number(m_level) + ")";
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
    const SystemMonsterTroop *monsterTroop = monsterTroop = reinterpret_cast<
        const SystemMonsterTroop *>(&super);

    p_id = monsterTroop->p_id;
    this->updateName();
    m_level = monsterTroop->m_level;
    m_isSpecificPosition = monsterTroop->m_isSpecificPosition;
    m_specificPosition->setCopy(*monsterTroop->m_specificPosition);
}

// -------------------------------------------------------

void SystemMonsterTroop::read(const QJsonObject &json)
{
    p_id = json[SuperListItem::JSON_ID].toInt();
    this->updateName();
    m_level = json[JSON_LEVEL].toInt();
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
    json[JSON_LEVEL] = m_level;
    if (m_isSpecificPosition != DEFAULT_IS_SPECIFIC_POSITION)
    {
        json[JSON_IS_SPECIFIC_POSITION] = m_isSpecificPosition;
    }
    if (!m_specificPosition->isDefaultMessageValue())
    {
        QJsonObject obj;
        m_specificPosition->write(obj);
        json[JSON_SPECIFIC_POSITION] = obj;
    }
}
